import {postAPI} from "../service/PostService.jsx";
import {useQueries} from "@tanstack/react-query";


export const useProductQueries = (postIds) => {
    const queries = postIds.map((postId) => ({
        queryKey: ['postDetail', postId],
        queryFn: () => postAPI.getPostDetail(postId),
        enabled: !!postId
    }));

    return useQueries({queries});
}