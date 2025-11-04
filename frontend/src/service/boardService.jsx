import api from "../api/apiClient.jsx";


//게시글 가져오기
export const boardAPI = {
    getBoardList : async (currentPage = 0, categories = []) => {
        let categoryParams = '';
        if (categories && categories.length > 0) {
            categoryParams = categories.map(category => `category="${category}"`).join('&');
            categoryParams = `&${categoryParams}`;
        }

        const res = await api.get(`/api/v1/board/list?currentPage=${currentPage}${categoryParams}`);
        return res.data;
    },

    write: async (formData) => {
        const res = await api.post(`/api/v1/board`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    getBoardDetail: async (boardId) => {
        if(!boardId){
            throw new Error("게시글 ID가 필요합니다");
        }

        const res = await api.get(`/api/v1/board/${boardId}`);

        return res.data;
    },

    update: async (formData) => {
        const id = formData.get('id');

        const res = await api.put(`/api/v1/board/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    delete: async (boardId) => {
        const res = await api.delete(`/api/v1/board/${boardId}`);
        return res.data;
    }


}