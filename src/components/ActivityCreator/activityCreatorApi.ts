import { useQuery } from "@tanstack/react-query";
import { fetchAniListRemainingRequestLimit, fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, querySearchAnimeActivity, queryUserOptions, queryMediaListEntryUserStats, mutationSaveMediaListEntry, mutationUserOptions, mutationPrivateMediaEntry } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivityCreatorSearchVariables, MediaEntry } from "../../utils/anilistInterfaces";
import { AxiosError } from "axios";

export const useActivityCreator = (variables: ActivityCreatorSearchVariables) => {
    const user = useContext(UserContext)
    const loggedInUserId = user?.id
    const remainingRequestsBuffer = 12; //A bit higher than necessary because AniList remainingRequest header can be funky. 8 necessary worst case

    async function returnUserToBeforeState(previousActivityMergeTime: number | null, previousMediaEntryStats: MediaEntry | null) {
        // If we changed the merge time, back to normal
        if (previousActivityMergeTime) {
            await fetchFromAnilist(mutationUserOptions, { activityMergeTime: previousActivityMergeTime })
        }

        // privately return stats to normal (to not create activity), then adjust private if necessary
        if (previousMediaEntryStats) {
            await fetchFromAnilist(mutationSaveMediaListEntry, { ...previousMediaEntryStats, private: true })
            if (!previousMediaEntryStats.private) {
                await fetchFromAnilist(mutationPrivateMediaEntry, { private: false, mediaId: previousMediaEntryStats.mediaId })
            }
        }
    }

    return useQuery({
        queryKey: ['activityCreator', variables],
        queryFn: async () => {
            if (!loggedInUserId) throw new Error("User not logged in.");

            let currentUserActivityMergeTime: number | null = null;
            let currentMediaEntryStats: MediaEntry | null = null;
            let didChangeMergeTime = false;
            let didChangeMediaEntryStats = false;

            const remainingRequests = await fetchAniListRemainingRequestLimit()
            if (remainingRequests < remainingRequestsBuffer) {
                throw new Error(`Rate limit too close. Please wait 1min and try again.`);
            }

            let mediaId
            try {
                const media = await fetchFromAnilist(querySearchMedia, variables)
                mediaId = media.Media.id
            } catch {
                throw new Error("Media cannot be found");
            }

            try {
                if (variables.noMerge) {
                    try {
                        const currentUserOptions = await fetchFromAnilist(queryUserOptions, { userId: loggedInUserId })
                        currentUserActivityMergeTime = currentUserOptions.User.options.activityMergeTime
                        await fetchFromAnilist(mutationUserOptions, { activityMergeTime: 0 })
                        didChangeMergeTime = true
                    } catch (e) {
                        console.error(e)
                        throw new Error("Error while fetching current user statistics")
                    }
                }

                try {
                    const currentMediaEntry = await fetchFromAnilist(queryMediaListEntryUserStats, { userId: loggedInUserId, mediaId: mediaId })
                    currentMediaEntryStats = {
                        mediaId: mediaId,
                        private: currentMediaEntry.MediaList.private,
                        status: currentMediaEntry.MediaList.status,
                        progress: currentMediaEntry.MediaList.progress
                    }
                } catch (e: unknown) {
                    if (!(e instanceof AxiosError)) {
                        throw new Error("Error while fetching media entry");
                    }
                    if (e.response?.status === 404 && e.message === 'Not Found.') {
                        // No entry for this media on user yet. That's fine.
                    } else {
                        throw new Error("Error while fetching media entry");
                    }
                }

                const updatedVariables = { ...variables, mediaId: mediaId, private: false }
                await fetchFromAnilist(mutationSaveMediaListEntry, updatedVariables)
                didChangeMediaEntryStats = true;
            } finally {
                try {
                    await returnUserToBeforeState(
                        didChangeMergeTime ? currentUserActivityMergeTime : null,
                        didChangeMediaEntryStats ? currentMediaEntryStats : null
                    );
                } catch (cleanupError) {
                    console.error("Cleanup failed! User data might be inconsistent.", cleanupError);
                }

            }
        },
        retry: false,
        enabled: Object.keys(variables).length > 0,
        staleTime: Infinity
    })
};