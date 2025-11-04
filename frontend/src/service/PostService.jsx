import api from "../api/apiClient.jsx";


//게시글 가져오기
export const postAPI = {
    getPostList : async (currentPage = 0, categories = [], fileType = null) => {
        let categoryParams = '';
        if (categories && categories.length > 0) {
            categoryParams = categories.map(category => `category="${category}"`).join('&');
            categoryParams = `&${categoryParams}`;
        }

        const fileTypeParam = fileType ? `&fileType=${fileType}` : '';

        const res = await api.get(`/api/v1/post/list?currentPage=${currentPage}${categoryParams}`);
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

    update: async (formData) => {
        const id = formData.get('id');

        const res = await api.put(`/api/v1/post/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    delete: async (postId) => {
        const res = await api.delete(`/api/v1/post/${postId}`);
        return res.data;
    }


}