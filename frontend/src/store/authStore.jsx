import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";


export const useAuthStore = create(
    persist(
        immer((set, get) => ({
            token : null,
            userId : null,
            userName : null,
            userRole : null,

            isAuthenticated : () => !!get().token,
            getRole : () => get().userRole,

            login : ({token, userId, userName, userRole}) => {
                set((state) =>
                {
                    state.token = token;
                    state.userId = userId;
                    state.userName = userName;
                    state.userRole = userRole;
                });
            },

            logout : () => {
                set((state) =>
                {
                    state.token = null;
                    state.userId = null;
                    state.userName = null;
                    state.userRole = null;
                })
                useAuthStore.persist.clearStorage();
            },
            getToken : () => get().token,
            clearAuth : () => {
                set((state) =>
                {
                    state.token = null;
                    state.userId = null;
                    state.userName = null;
                    state.userRole = null;
                })

                //localStorage 삭제
                useAuthStore.persist.clearStorage();
            }

            })
        ),
        {
            name : 'authStore'
        }
    )
);