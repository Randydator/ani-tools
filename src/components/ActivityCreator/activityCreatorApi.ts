import { useMutation } from "@tanstack/react-query";
import { fetchAniListRemainingRequestLimit, fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, queryUserOptions, queryMediaListEntryUserStats, mutationSaveMediaListEntry, mutationUserOptions, mutationPrivateMediaEntry } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivityCreatorSearchVariables, MediaEntry } from "../../utils/anilistInterfaces";
import { AxiosError } from "axios";

export const useActivityCreator = () => {
    const user = useContext(UserContext)
    const loggedInUserId = user?.id
    const remainingRequestsBuffer = 14; //A bit higher than necessary because AniList remainingRequest header can be funky. 8 necessary worst case

    async function returnUserToBeforeState(previousActivityMergeTime: number | null, previousMediaEntryStats: MediaEntry | null) {
        // If we changed the merge time, back to normal
        if (previousActivityMergeTime) {
            await fetchFromAnilist(mutationUserOptions, { activityMergeTime: previousActivityMergeTime })
        }

        // privately return stats to normal (to not create activity), then adjust private if necessary
        if (previousMediaEntryStats) {
            const privateUpdatedVariables = { ...previousMediaEntryStats, private: true }
            await fetchFromAnilist(mutationSaveMediaListEntry, privateUpdatedVariables)

            //When setting it to completed after a rewatch in previous step, it adds repeat + 1 after I set it to 0. Meaning we always need a 2nd request to set it to previous value.
            await fetchFromAnilist(mutationPrivateMediaEntry, { private: previousMediaEntryStats.private, mediaId: previousMediaEntryStats.mediaId, repeat: previousMediaEntryStats.repeat })
        }
    }

    async function safelyCreateActivity(variables: ActivityCreatorSearchVariables) {
        if (!loggedInUserId) throw new Error("User not logged in.");
        if (!variables.title) throw new Error("Title is required.");

        let currentUserActivityMergeTime: number | null = null;
        let currentMediaEntryStats: MediaEntry | null = null;
        let didChangeMergeTime = false;
        let didChangeMediaEntryStats = false;

        const remainingRequests = await fetchAniListRemainingRequestLimit()
        if (remainingRequests < remainingRequestsBuffer) {
            throw new Error(`Rate limit too close. Please wait 1 minute and try again.`);
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
                } catch {
                    throw new Error("Error while fetching current user statistics")
                }
            }

            try {
                const currentMediaEntry = await fetchFromAnilist(queryMediaListEntryUserStats, { userId: loggedInUserId, mediaId: mediaId })
                currentMediaEntryStats = {
                    mediaId: mediaId,
                    private: currentMediaEntry.MediaList.private,
                    status: currentMediaEntry.MediaList.status,
                    progress: currentMediaEntry.MediaList.progress,
                    repeat: currentMediaEntry.MediaList.repeat
                }
            } catch (e: unknown) {
                if (!(e instanceof AxiosError)) {
                    throw new Error("Error while fetching media entry");
                }
                if (e.response?.status === 404) {
                    // No entry for this media on user yet. That's fine.
                } else {
                    throw new Error("Error while fetching media entry");
                }
            }

            try {
                const updatedVariables = { ...variables, mediaId: mediaId, private: false }
                await fetchFromAnilist(mutationSaveMediaListEntry, updatedVariables)
                didChangeMediaEntryStats = true;
            } catch {
                throw new Error("Failed to update media entry stats")
            }
        } finally {
            try {
                await returnUserToBeforeState(
                    didChangeMergeTime ? currentUserActivityMergeTime : null,
                    didChangeMediaEntryStats ? currentMediaEntryStats : null
                );
            } catch (cleanupError) {
                console.error("Cleanup failed! User data might be inconsistent.", cleanupError);
                // eslint-disable-next-line no-unsafe-finally
                throw new Error("Failed to clean up user state. Check if your activity merge time and this media entry stats are still ok.")
            }
        }
    }

    return useMutation({
        mutationFn: (variables: ActivityCreatorSearchVariables) =>
            safelyCreateActivity(variables)
    })
};