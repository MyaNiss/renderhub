import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {commentAPI} from "../service/commentSesrvice.jsx";


export const useGetCommentList = (resourceType, parentId, currentPage, pagePerRows) => {
    return useQuery({
        queryKey: ['comments', resourceType, parentId, currentPage, pagePerRows],
        queryFn: () => commentAPI.getCommentList(resourceType, parentId, currentPage, pagePerRows),
    });
};

export const useComment = () => {
    const queryClient = useQueryClient();

    const writeCommentMutation = useMutation({
        mutationFn: ({resourceType, parentId, requestBody}) => commentAPI.writeComment({resourceType, parentId, requestBody}),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ['comments', variables.resourceType, variables.parentId]});

            console.log('댓글 작성 성공', data);
        }
    });

    const updateCommentMutation = useMutation({
        mutationFn: ({commentId, requestBody, resourceType, parentId}) => commentAPI.updateComment({commentId, requestBody}),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ['comments', variables.resourceType, variables.parentId]});
            console.log("댓글 수정 성공", data);
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: ({commentId, resourceType, parentId}) => commentAPI.deleteComment({commentId, resourceType, parentId}),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ['comments', variables.resourceType, variables.parentId]});
            console.log("댓글 삭제 성공");
        }
    });

    return {writeCommentMutation, updateCommentMutation, deleteCommentMutation};
}