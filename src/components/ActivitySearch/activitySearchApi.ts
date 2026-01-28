import { useQuery } from "@tanstack/react-query";
import { queryAnilist } from "../../utils/anilistApiClient";
import { querySearchMedia, querySearchAnimeActivity, querySearchUsername } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivitySearchVariables } from "../../utils/anilistInterfaces";

export const useActivitySearch = (variables: ActivitySearchVariables | object) => { 
    const user = useContext(UserContext)
    const loggedInUserId = user?.id

    return useQuery({
        queryKey: ['activitySearch', variables],
        queryFn: async () => {

            // try catch each request for proper error handling
            let userId
            try {
                if ('username' in variables && variables.username.trim() !== "") {
                    userId = await queryAnilist(querySearchUsername, variables)
                }
            } catch {
                throw new Error("User cannot be found");
            }

            let mediaId
            try {
                mediaId = await queryAnilist(querySearchMedia, variables)
            } catch {
                throw new Error("Media cannot be found");
            }

            const updatedVariables = { ...variables, userId: userId?.User?.id || loggedInUserId, mediaId: mediaId.Media.id }
            let activityData
            try {
                activityData = await queryAnilist(querySearchAnimeActivity, updatedVariables)
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