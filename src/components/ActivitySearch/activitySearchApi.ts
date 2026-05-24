import { useQuery } from "@tanstack/react-query";
import { queryAnilist } from "../../utils/anilistApiClient";
import { querySearchMediaByTitle, querySearchAnimeActivity, querySearchUsername, querySearchMediaById } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivitySearchVariables } from "../../utils/anilistInterfaces";

export const useActivitySearch = (variables: ActivitySearchVariables) => {
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

            let media
            // media provided if clicked on an entry in PreviewSearch, otherwise try to find media via title search
            try {
                if (variables.mediaId) {
                    media = await queryAnilist(querySearchMediaById, variables)
                } else {
                    media = await queryAnilist(querySearchMediaByTitle, variables)
                }
            } catch {
                throw new Error("Media cannot be found");
            }


            const updatedVariables = { ...variables, userId: userId?.User?.id || loggedInUserId, mediaId: media.Media.id }
            let activityData
            try {
                activityData = await queryAnilist(querySearchAnimeActivity, updatedVariables)
            } catch {
                throw new Error("Activities cannot be found");
            }

            // add media title to give user feedback what media anilist fuzzy search found
            return {
                ...activityData,
                mediaTitle: media.Media.title.english ? media.Media.title.english : media.Media.title.romaji,
                mediaCoverImage: media.Media.coverImage.large
            }
        },
        retry: false,
        enabled: Object.keys(variables).length > 0,
        staleTime: Infinity
    })
};