import api from "../api/apiClient.jsx";

export const accountAPI = {

    login: async (loginData) => {

        const requestData = {
            username: loginData.userId,
            password: loginData.password,
        };

        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true
        };

        const res = await api.post('/api/v1/login', requestData, config);
        return res;
    },
    logout: async () => {
        const res = await api.get('/api/v1/logout');

        return res.data;
    },
    register: async (registerData) => {
        const res = await api.post('/api/v1/user/register', registerData);
        return res.data;
    }
}