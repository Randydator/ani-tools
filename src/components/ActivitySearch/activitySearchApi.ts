import { useQuery } from "@tanstack/react-query";
import { fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, querySearchAnimeActivity, querySearchUsername } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";

export const useActivitySearch = (variables: any) => {
    const user = useContext(UserContext)
    const loggedInUserId = user?.id

    return useQuery({
        queryKey: ['activitySearch', variables],
        queryFn: async () => {
            // try catch each request for proper error handling

            let userId
            try {
                if (variables.username.trim() !== "") {
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