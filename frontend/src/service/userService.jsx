import api from "../api/apiClient.jsx";


export const userAPI = {
    getUser: async (userId, isPublic = true) => {
        let url;

        if(isPublic){
            url = `/api/v1/user/${userId}/public`;
        } else {
            url = `/api/v1/user/${userId}`;
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

    updateUser: async (dataToSend) => {
        if(!dataToSend) {
            throw new Error("수정할 정보가 필요합니다");
        }
        const res = await api.put('/api/v1/user', dataToSend);
        return res.data;
    },

    deleteUser: async () => {
        const res = await api.delete('/api/v1/user');
        return res.data;
    },

    reAuthenticateUser: async (dataToSend) => {
        const res = await api.post('/api/v1/user/reAuth', dataToSend);
        return res.data;
    },

    updatePassword: async (dataToSend) => {
        const res = await api.post('/api/v1/user/password', dataToSend);
        return res.data;
    }
}