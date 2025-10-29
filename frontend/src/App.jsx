import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router";
import {router} from "./router/router.jsx";
import './App.css';
import 'react-quill-new/dist/quill.snow.css';
import axios from "axios";
import {useAuthStore} from "./store/authStore.jsx";
import {useEffect, useState} from "react";

//react-query 설정
const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: true,
          retry: 1,
          staleTime : 6000,
          gcTime: 6000
        }
      },
    }
)

const loginUser = async () => {
    const loginData = {
        username: 'admin',
        password: '1234'
    };

    try {
        const response = await axios.post('/api/v1/login', loginData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        // 획득한 토큰과 사용자 정보를 ZUSTAND Store에 저장
        useAuthStore.getState().login(response.data.content);

        alert("로그인 성공!");

    } catch (error) {
        console.error("로그인 실패:", error.response.data);
        alert("로그인에 실패했습니다. ID와 비밀번호를 확인하세요.");
    }
};

function App() {
    const [isAuthSetupComplete, setIsAuthSetupComplete] = useState(false);

    useEffect(() => {
        const setupAuth = async () => {
            // 1. 이미 토큰이 존재하면 (이전에 로그인했거나 저장소에 남아있다면)
            if (useAuthStore.getState().token) {
                console.log("기존 토큰 발견. 바로 시작.");
                setIsAuthSetupComplete(true);
                return;
            }

            // 2. 토큰이 없다면 비동기로 로그인 시도
            const success = await loginUser(); // 🚨 로그인 완료까지 기다림

            // 3. 로그인 성공 여부와 관계없이 setup이 완료되었음을 표시
            // (실패해도 앱을 띄우거나, 에러 처리를 할 수 있도록)
            setIsAuthSetupComplete(true);
        };

        // 🚨 이 App 컴포넌트가 처음 마운트될 때만 로그인 설정 시작
        setupAuth();
    }, []);

    // 🚨 [핵심 수정]: 인증 설정이 완료될 때까지 로딩 화면 표시
    if (!isAuthSetupComplete) {
        // 백엔드 연결 실패, 토큰 획득 중 등 초기 로딩 상태
        return <div>가상 로그인 설정 중... 잠시만 기다려 주세요.</div>;
    }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </>
  )
}

export default App
