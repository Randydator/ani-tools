import { useQuery } from "@tanstack/react-query";
import { fetchFromAnilist } from "../../utils/anilistRequestUtil";
import { querySearchMediaPreview } from "../../utils/anilistQueries";
import { MediaPreview, MediaType } from "../../utils/anilistInterfaces";

export const usePreviewSearch = (variables: { searchTerm: string; type: MediaType }, enabled: boolean) => {
    return useQuery({
        queryKey: ['previewSearch', variables],
        queryFn: async () => {
            if (variables.searchTerm.trim() === "") return []

            const rawPreviewData =  await fetchFromAnilist(querySearchMediaPreview, variables)
            const previewData: MediaPreview[] = rawPreviewData.Page.media
            return previewData
        },
        retry: false,
        enabled: enabled,
        staleTime: Infinity
    })
};