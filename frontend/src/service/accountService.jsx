import api from "../api/apiClient.jsx";

export const accountAPI = {
    logout: async () => {
        const res = await api.get('/api/v1/logout');

        return res.data;
    }
}