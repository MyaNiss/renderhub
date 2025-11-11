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

    writeComment: async ({resourceType, parentId, requestBody}) => {
        if (!resourceType || !parentId) {
            throw new Error("게시글 타입과 ID가 필요합니다");
        }
        const res = await api.post(`/api/v1/comments/${resourceType}/${parentId}`, requestBody);

        return res.data;
    },

    updateComment: async ({commentId, requestBody}) => {
        const res = await api.put(`/api/v1/comments/${commentId}`, requestBody);
        return res.data;
    },

    deleteComment: async ({commentId, resourceType, parentId}) => {
        const res = await api.delete(`/api/v1/comments/${commentId}`);
        return res.data;
    }
}