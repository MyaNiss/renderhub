import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "../store/authStore.jsx";
import {userAPI} from "../service/userService.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";


export const useUser = (userId, isPublic = true) => {
    const queryClient = useQueryClient();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

    const getUserProfile = useQuery({
        queryKey: ['userProfile', userId, isPublic],
        queryFn: () => userAPI.getUser(userId, isPublic),
        enabled: isAuthenticated
    });

    const updateUserMutation = useMutation({
        mutationFn: (dataToSend) => userAPI.updateUser(dataToSend),
        onSuccess: () => {
            alert("회원 정보가 수정되었습니다");

            queryClient.invalidateQueries({queryKey: ['userProfile']});
        }
    });

    const registerUserMutation = useMutation({
        mutationFn: (formData) => userAPI.registerUser(formData),
        onSuccess: () => {
            alert("회원가입이 완료되었습니다");
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: userAPI.deleteUser,
        onSuccess: () => {
            alert("회원 탈퇴가 완료되었습니다");
            queryClient.invalidateQueries({queryKey: ['userProfile']});
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: (formData) => userAPI.updatePassword(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userProfile']});
        }
    })

    return{getUserProfile,updateUserMutation,registerUserMutation,deleteUserMutation, updatePasswordMutation};
}