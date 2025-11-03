import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {orderAPI} from "../service/orderService.jsx";


export const useOrder = (orderId) => {

    const queryClient = useQueryClient();
    const cartQueryKey = ['cartItems'];


    const getOrders = useQuery({
        queryKey: ['orderHistory'],
        queryFn: orderAPI.getOrders
    });

    const getOrder = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderAPI.getOrder(orderId),
        enabled: !!orderId
    });

    const createOrderMutation = useMutation({
        mutationFn: (orderData) => orderAPI.createOrder(orderData),
        onSuccess: (data) => {
            console.log("주문 생성", data);
        }
    });

    const confirmPaymentMutation = useMutation({
        mutationFn: (paymentResult) => orderAPI.confirmPayment(paymentResult),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartQueryKey });
            queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
        }
    });

    return { getOrders, getOrder, createOrderMutation, confirmPaymentMutation };

}