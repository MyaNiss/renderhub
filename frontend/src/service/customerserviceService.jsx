import api from "../api/apiClient.jsx";


export const csAPI = {

    getCsList: async ({currentPage = 0, categories = [], userId = null, userRole = null}) => {
        const params = [];

        params.push(`currentPage=${currentPage}`);

        if (categories && categories.length > 0) {
            const categoryString = categories
                .map(id => `categoryId=${id}`)
                .join('&');

            params.push(categoryString);
        }

        // if (userId) {
        //     params.push(`userId=${userId}`);
        // }
        // if (userRole) {
        //     params.push(`userRole=${userRole}`);
        // }

        const queryString = params.join('&');

        const res = await api.get(`/api/v1/cs/list?${queryString}`);
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
        const csId = formData.get('csId');

        const res = await api.put(`/api/v1/cs/${csId}`, formData, {
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