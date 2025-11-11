import {postAPI} from "../service/PostService.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";


export const usePostDetail = (postId) => {
    const query = useQuery({
        queryKey: ['postDetail', postId],
        queryFn: () => postAPI.getPostDetail(postId),

        enabled: !!postId
    });

    return query;
}

export const usePost = () => {
    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: (formData) => postAPI.write(formData),
        onSuccess: (newPostData) => {
            alert("게시글이 성공적으로 등록되었습니다");

            queryClient.invalidateQueries({queryKey : ['postList']});
        }
    })

    const updatePostMutation = useMutation({
        mutationFn: ({postId, updateData}) => postAPI.update(postId, updateData),
        onSuccess: (data, variables) => {
            alert("게시글 수정이 완료되었습니다");

            queryClient.invalidateQueries({ queryKey: ['postDetail', variables.postId]});
            queryClient.invalidateQueries({ queryKey: ['postList']});
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: (postId) => postAPI.delete(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postList']});
        }
    })

    return {createPostMutation, updatePostMutation, deletePostMutation };
}