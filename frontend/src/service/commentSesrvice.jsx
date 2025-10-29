import api from "../api/apiClient.jsx";


export const commentAPI = {
    getCommentList: async (resourceType, parentId, currentPage = 0, pagePerRows = 5) => {
        if(!resourceType || !parentId){
            throw new Error("게시글 타입과 ID가 필요합니다");
        }

        const res = await api.get(`/api/v1/comments/${resourceType}/${parentId}`,{
            params: {
                currentPage: currentPage,
                pagePerRows: pagePerRows
            }
        });

        return res.data;
    },

    writeComment: async ({resourceType, parentId, formData}) => {
        if (!resourceType || !parentId) {
            throw new Error("게시글 타입과 ID가 필요합니다");
        }

        const res = await api.post(`/api/v1/comments/${resourceType}/${parentId}`, formData);

        return res.data;
    },

    updateComment: async ({commentId, formData}) => {
        const res = await api.put(`/api/v1/comments/${commentId}`, formData);
        return res.data;
    },

    deleteComment: async (commentId) => {
        const res = await api.delete(`/api/v1/comments/${commentId}`);
        return res.data;
    }
}