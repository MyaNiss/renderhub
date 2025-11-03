import api from "../api/apiClient.jsx";


export const userAPI = {
    getUser: async (userId, isPublic = true) => {
        let url;

        if(isPublic){
            url = `/api/users/${userId}/public`;
        } else {
            url = `/api/users/${userId}`;
        }

        const res = await api.get(url);
        return res.data;
    },

    registerUser: async (formData) => {
        if(!formData) {
            throw new Error("회원가입 정보가 필요합니다");
        }

        const res = await api.post('/api/v1/user', formData);
        return res.data;
    },

    updateUser: async (formData) => {
        if(!formData) {
            throw new Error("수정할 정보가 필요합니다");
        }
        const res = await api.put('/api/v1/user', formData);
        return res.data;
    },

    deleteUser: async () => {
        const res = await api.delete('/api/v1/user');
        return res.data;
    },

    reAuthenticateUser: async (password) => {
        const res = await api.post('/api/v1/reAuth', {
            password : password
        });
        return res.data;
    }
}