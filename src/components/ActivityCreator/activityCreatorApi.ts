import { useQuery } from "@tanstack/react-query";
import { fetchAniListRemainingRequestLimit, fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, querySearchAnimeActivity, queryUserOptions, queryMediaListEntryUserStats, mutationSaveMediaListEntry, mutationUserOptions } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivityCreatorSearchVariables, MediaEntry } from "../../utils/anilistInterfaces";
import { AxiosError } from "axios";

export const useActivityCreator = (variables: ActivityCreatorSearchVariables) => {
    const user = useContext(UserContext)
    const loggedInUserId = user?.id
    const remainingRequestsBuffer = 12; //A bit higher than necessary because AniList remainingRequest header can be funky

    /* TODO: 
        1 request > get current stats (for setting back later)
        If possible, get rate limit remaining from this request. If not, send rate limit request before. Going over rate limit in the middle very bad. 
        1 request > get userOptions (merge time)

        Let's say user wants to rewatch episode 9/12 and had it as completed before. 
        (Optional): Set merge time to never
        Create activity: private: false; progress: 9, status: repeating, mediaId...
        Return mediaEntry stats to before in private: private: true, progress: like before; status: like before: mediaId..., repeat: like before
        1 request > set private to before
        
        (Optional): Set merge time to before

        */

    async function returnUserToBeforeState(previousActivityMergeTime: number | null, previousMediaEntryStats: MediaEntry | null) {
        // If we changed the merge time, back to normal
        if (previousActivityMergeTime) {
            await fetchFromAnilist(mutationUserOptions, { activityMergeTime: currentUserActivityMergeTime })
        }

        if (previousMediaEntryStats) {
            const previousMediaEntryStats = {}
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
                    currentMediaEntryStats = await fetchFromAnilist(queryMediaListEntryUserStats, { userId: loggedInUserId, mediaId: mediaId })
                    // TODO: I am changing status progress private. Write that together with media ID into the current object. Then continue function above
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

                const updatedVariables = { ...variables, mediaId: mediaId.Media.id, private: false }
                await fetchFromAnilist(mutationSaveMediaListEntry, updatedVariables)
                didChangeMediaEntryStats = true;


            } finally {
                returnUserToBeforeState(
                    didChangeMergeTime ? currentUserActivityMergeTime : null,
                    didChangeMediaEntryStats ? currentMediaEntryStats : null
                )
            }

            /* add anime title to give user feedback what media anilist fuzy search found
            return {
                ...activityData,
                animeTitle: mediaId.Media.title.english ? mediaId.Media.title.english : mediaId.Media.title.romaji
            }
            */
        },
        retry: false,
        enabled: Object.keys(variables).length > 0,
        staleTime: Infinity
    })
};