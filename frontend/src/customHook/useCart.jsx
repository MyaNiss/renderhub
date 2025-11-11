import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {cartAPI} from "../service/cartService.jsx";
import {useEffect} from "react";


export const useCart = (isCartOpen) => {
    const queryClient = useQueryClient();

    const cartQueryKey = ['cartItems'];

    const getCartItems = useQuery({
        queryKey: cartQueryKey,
        queryFn: () => cartAPI.getCart(),
        enabled: isCartOpen,
    });


    const addCart = useMutation({
        mutationFn: (postId) => cartAPI.addCart(postId),
        onSuccess: () => {
            alert("장바구니에 상품을 담았습니다");
            queryClient.invalidateQueries({queryKey: cartQueryKey});
        }
    });

    const deleteCartItem = useMutation({
        mutationFn: (postId) => cartAPI.deleteCartItem(postId),
        onSuccess: () => {
            alert("상품이 장바구니에서 삭제되었습니다");
            queryClient.invalidateQueries({queryKey: cartQueryKey});
        }
    });

    const clearCart = useMutation({
        mutationFn: cartAPI.clearCart,
        onSuccess: () => {
            alert("장바구니가 삭제되었습니다");
            queryClient.setQueryData(cartQueryKey, []);
        }
    });

    return {getCartItems, addCart, deleteCartItem, clearCart};

};