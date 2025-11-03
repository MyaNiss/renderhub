import api from "../api/apiClient.jsx";


export const cartAPI = {

    getCart: async () => {
        const res = await api().get('/api/v1/cart');
        return res.data;
    },

    addCart: async (postId) => {
        if(!postId){
            throw new Error("postId 가 필요합니다");
        }
        const res = await api.post('/api/v1/cart', postId);
        return res.data;
    },

    deleteCartItem: async (postId) => {
        if(!postId){
            throw new Error("삭제할 postId가 필요합니다");
        }
        const res = await api.delete(`/api/v1/cart/${postId}`);
        return res.data;
    },

    clearCart: async () => {
        const res = await api.delete('/api/v1/cart/all');
        return res.data;
    }

}