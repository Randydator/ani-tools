import { useQuery } from "@tanstack/react-query";
import { queryAnilist } from "../../utils/anilistApiClient";
import { querySearchMediaByTitle, querySearchAnimeActivity, querySearchUsername, querySearchMediaById } from "../../utils/anilistQueries";
import { UserContext } from "../Header/UserContext";
import { useContext } from "react";
import { ActivitySearchVariables } from "../../utils/anilistInterfaces";

function validateActivitySearchVariables(variables: ActivitySearchVariables | null | undefined, loggedInUserId: number | undefined): boolean {
    if (!variables) return false

    // require a media type and at least one non-empty search field
    if (!variables.type) return false

    const hasUsername = Boolean(variables.username.trim() !== "") || loggedInUserId !== undefined
    const hasTitleOrMediaId = Boolean(variables.title && variables.title.toString().trim() !== "") || variables.mediaId !== null

    return hasUsername && hasTitleOrMediaId
}


export const useActivitySearch = (variables: ActivitySearchVariables) => {
    const user = useContext(UserContext)
    const loggedInUserId = user?.id

    return useQuery({
        queryKey: ['activitySearch', variables],
        queryFn: async () => {

            // try catch each request for proper error handling
            let userId
            try {
                userId = variables.username.trim() !== ""
                    ? await queryAnilist(querySearchUsername, variables)
                    : userId = loggedInUserId
            }
            catch {
                throw new Error("User cannot be found");
            }

            let media
            // media provided if clicked on an entry in PreviewSearch, otherwise try to find media via title search
            try {
                media = variables.mediaId
                    ? await queryAnilist(querySearchMediaById, variables)
                    : await queryAnilist(querySearchMediaByTitle, variables)
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

            return {
                ...activityData,
                mediaTitle: media.Media.title.english ? media.Media.title.english : media.Media.title.romaji,
                mediaCoverImage: media.Media.coverImage.large
            }
        },
        retry: false,
        enabled: validateActivitySearchVariables(variables, loggedInUserId),
        staleTime: Infinity
    })
};