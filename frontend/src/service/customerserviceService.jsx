import api from "../api/apiClient.jsx";


export const csAPI = {

    getCsList: async ({currentPage = 0, categories = [], userId = null, userRole = null}) => {
        let categoryParams = '';
        if (categories && categories.length > 0) {
            categoryParams = categories.map(category => `category=${category}`).join('&');
        }

        let authParams = '';
        if (userId) {
            authParams += `&userId=${userId}`;
        }
        if (userRole) {
            authParams += `&userRole=${userRole}`;
        }

        const queryParams = [
            `currentPage=${currentPage}`,
            categoryParams,
            authParams
        ].filter(p => p).join('&');

        const res = await api.get(`/api/v1/cs/list?${queryParams}`);
        return res.data;
    },

    write: async (formData) => {
        const res = await api.post(`/api/v1/cs`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    getCsDetail: async (csId) => {
        if(!csId){
            throw new Error("고객 지원 게시글 ID가 필요합니다");
        }
        const res = await api.get(`/api/v1/cs/${csId}`);

        return res.data;
    },

    update: async (formData) => {
        const id = formData.get('id');

        const res = await api.put(`/api/v1/cs/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return res.data;
    },

    delete: async (csId) => {
        const res = await api.delete(`/api/v1/cs/${csId}`);
        return res.data;
    }

}