import React, {useState} from 'react';
import {useNavigate} from "react-router";
import {useAuthStore} from "../store/authStore.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {accountAPI} from "../service/accountService.jsx";
import style from "../assets/css/auth.module.css";


const loginSchema = yup.object().shape({
    userId: yup.string().required("아이디를 입력해주세요."),
    password: yup.string().required("비밀번호를 입력해주세요."),
});

const LoginPage = () => {
    const navigate = useNavigate();
    const { login: storeLogin } = useAuthStore();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: { userId: '', password: '' }
    });

    const onSubmit = async (data) => {

        try {
            const response = await accountAPI.login(data);

            const accessToken = response.headers.get('Authorization')?.replace('Bearer ', '');
            const userData = response.data?.response;

            if (response.status === 200 && accessToken && userData) {

                useAuthStore.getState().login({
                    token: accessToken,
                    userId: userData.userId,
                    userName: userData.nickname || userData.name,
                    userRole: userData.roleName,
                });

                alert('로그인 성공!');
                navigate('/');
            } else {
                alert('로그인 실패: 서버 응답 오류 또는 토큰이 누락되었습니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert(error.response?.data?.message || '로그인 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className={style.container}>
            <div className={style.authBox}>
                <h2>로그인</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
                    <input
                        type="text"
                        placeholder="아이디"
                        {...register("userId")}
                        className={style.inputField}
                    />
                    {errors.userId && <p className={style.errorMessage}>{errors.userId.message}</p>}

                    <input
                        type="password"
                        placeholder="비밀번호"
                        {...register("password")}
                        className={style.inputField}
                    />
                    {errors.password && <p className={style.errorMessage}>{errors.password.message}</p>}

                    <button type="submit" className={style.submitButton}>
                        로그인
                    </button>
                    <p className={style.linkText}>
                        계정이 없으신가요? <a href="/register">회원가입</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;