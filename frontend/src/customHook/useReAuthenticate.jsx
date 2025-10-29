import {useCallback} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userAPI} from "../service/userService.jsx";


export const useReAuthenticate = () => {
    const queryClient = useQueryClient();

    const reAuthenticationMutation = useMutation({
        mutationFn: (password) => userAPI.reAuthenticateUser(password),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    })

    return {reAuthenticationMutation};
}