import { useQuery } from "@tanstack/react-query";
import { fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, querySearchAnimeActivity, querySearchUsername } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivitySearchVariables } from "../../utils/anilistInterfaces";

export const useActivitySearch = (variables: ActivitySearchVariables | object) => { 
    const user = useContext(UserContext)
    const loggedInUserId = user?.id

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

    return useQuery({
        queryKey: ['activitySearch', variables],
        queryFn: async () => {

            // try catch each request for proper error handling
            let userId
            try {
                if ('username' in variables && variables.username.trim() !== "") {
                    userId = await fetchFromAnilist(querySearchUsername, variables)
                }
            } catch {
                throw new Error("User cannot be found");
            }

            let mediaId
            try {
                mediaId = await fetchFromAnilist(querySearchMedia, variables)
            } catch {
                throw new Error("Media cannot be found");
            }

            const updatedVariables = { ...variables, userId: userId?.User?.id || loggedInUserId, mediaId: mediaId.Media.id }
            let activityData
            try {
                activityData = await fetchFromAnilist(querySearchAnimeActivity, updatedVariables)
            } catch {
                throw new Error("Activities cannot be found");
            }

            // add anime title to give user feedback what media anilist fuzy search found
            return {
                ...activityData,
                animeTitle: mediaId.Media.title.english ? mediaId.Media.title.english : mediaId.Media.title.romaji
            }
        },
        retry: false,
        enabled: Object.keys(variables).length > 0,
        staleTime: Infinity
    })
};