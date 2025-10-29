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
        mutationFn: ({resourceType, parentId, formData}) => commentAPI.writeComment({resourceType, parentId, formData}),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ['comments', variables.resourceType, variables.parentId]});

            console.log('댓글 작성 성공', data);
        }
    });

    const updateCommentMutation = useMutation({
        mutationFn: ({commentId, formData, resourceType, parentId}) => commentAPI.updateComment({commentId, formData}),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ['comments', variables.resourceType, variables.parentId]});
            console.log("댓글 수정 성공", data);
        }
    })

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => commentAPI.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['comments']});
            console.log("댓글 삭제 성공");
        }
    });

    return {writeCommentMutation, updateCommentMutation, deleteCommentMutation};
}