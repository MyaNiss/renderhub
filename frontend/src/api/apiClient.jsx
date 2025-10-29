import axios from "axios";
import {useAuthStore} from "../store/authStore.jsx";

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            // 헤더에 인증키 등록
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
let isRefreshing = false;

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response, config } = error;

        if (response.status === 401) {
            console.log("로그인 실패");
            useAuthStore.getState().clearAuth();
            return Promise.reject(error);
        }

        //토큰 만료
        if(response.status === 406 && !config._retry) {

            if(!isRefreshing) {
                isRefreshing = true;
                config._retry = true; // 무한 반복 금지
            }

            try {
                // 다른 ip간 통신 시 cors 에러 방지용
                const res = await api.get('/api/v1/refresh', {withCredentials: true});
                useAuthStore.getState().login(res.data.response.content);
                const token = useAuthStore.getState().token;
                config.headers.Authorization = `Bearer ${token}`;

                return api(config);

            }catch (e) {
                alert("유효하지 않은 토큰입니다");
                useAuthStore.getState().clearAuth();
                location.href="/login";
            }finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;