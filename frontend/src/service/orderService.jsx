import api from "../api/apiClient.jsx";


export const orderAPI = {

    getOrders: async () => {
        const res = await api.get(`/api/v1/orders`);
        return res.data;
    },

    getOrder: async (orderId) => {
        const res = await api.get(`/api/v1/orders/${orderId}`);
        return res.data;
    },

    createOrder: async (orderData) => {
        const res = await api.post(`/api/v1/orders/create`, orderData);
        return res.data;
    },

    confirmPayment: async (paymentResult) => {
        const res = await api.post(`/api/v1/orders/confirm`, paymentResult);
        return res.data;
    }
}