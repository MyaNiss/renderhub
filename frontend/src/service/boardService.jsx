import api from "../api/apiClient.jsx";


//게시글 가져오기
export const boardAPI = {

    getCategories: async () => {
        const res = await api.get('/api/v1/categories');
        return res.data;
    },

    getBoardList : async (currentPage = 0, categories = []) => {
        let categoryParams = '';
        if (categories && categories.length > 0) {
            categoryParams = categories
                .map(id => `categoryId=${id}`)
                .join('&');

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
        const boardId = formData.get('boardId');

        const res = await api.put(`/api/v1/board/${boardId}`, formData, {
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