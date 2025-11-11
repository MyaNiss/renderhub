import api from "../api/apiClient.jsx";


//게시글 가져오기
export const postAPI = {
    getPostList : async (currentPage = 0, categories = [], fileType = null, keyword = null) => {
        let categoryParams = '';
        if (categories && categories.length > 0) {
            categoryParams = categories.map(category => `categoryIds=${category}`).join('&');
            categoryParams = `&${categoryParams}`;
        }
        let fileTypeParam = '';
        if (fileType) {
            fileTypeParam = `&fileTypeIds=${fileType}`;
        }
        let keywordParam = '';
        if (keyword && keyword.trim() !== ''){
            keywordParam = `&keyword=${encodeURIComponent(keyword.trim())}`;
        }

        const res = await api.get(`/api/v1/post/list?currentPage=${currentPage}` + categoryParams + fileTypeParam + keywordParam);
        return res.data;
    },

    write: async (formData) => {
        const res = await api.post(`/api/v1/post`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    getPostDetail: async (postId) => {
        if(!postId){
            throw new Error("제품 ID가 필요합니다");
        }

        const res = await api.get(`/api/v1/post/${postId}`);

        return res.data;
    },

    update: async (postId, formData) => {
        const res = await api.put(`/api/v1/post/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    delete: async (postId) => {
        const res = await api.delete(`/api/v1/post/${postId}`);
        return res.data;
    },

    getTopPurchasedItems: async (limit = 4) => {
        try {
            const response = await api.get('/api/v1/post/recommendations', {
                params: {
                    sortBy: 'purchaseCount',
                    orderBy: 'desc',
                    limit: limit,
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}