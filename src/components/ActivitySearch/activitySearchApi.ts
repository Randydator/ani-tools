import { useQuery } from "@tanstack/react-query";
import { fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMedia, querySearchAnimeActivity, querySearchUsername } from "../../utils/anilistQueries";

export const useActivitySearch = (variables: Object) => {
    console.log(variables)
    return useQuery({
        queryKey: ['activitySearch', variables],
        queryFn: async () => {
            const userId = await fetchFromAnilist(querySearchUsername, variables)
            const mediaId = await fetchFromAnilist(querySearchMedia, variables)
            const updatedVariables = { ...variables, userId: userId.User.id, mediaId: mediaId.Media.id }
            const activityData = await fetchFromAnilist(querySearchAnimeActivity, updatedVariables)
            return activityData
        },
        retry: false,
        enabled: Object.keys(variables).length > 0,
        staleTime: Infinity

    })
};