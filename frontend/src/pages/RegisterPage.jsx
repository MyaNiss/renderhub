import React, { useState } from 'react';
import style from '../assets/css/auth.module.css';
import { accountAPI } from '../service/accountService.jsx';
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";

const registerSchema = yup.object().shape({
    userId: yup.string().required("아이디는 필수입니다.").min(4, "최소 4자 이상이어야 합니다.").max(50, "최대 50자까지 가능합니다."),
    password: yup.string().required("비밀번호는 필수입니다.").min(8, "최소 8자 이상이어야 합니다."),
    passwordCheck: yup.string()
        .required("비밀번호 확인은 필수입니다.")
        .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'), // 🚨 비밀번호 일치 검증
    nickname: yup.string().required("닉네임은 필수입니다.").max(30, "최대 30자까지 가능합니다."),
    name: yup.string().required("이름은 필수입니다.").max(50, "최대 50자까지 가능합니다."),
    email: yup.string().required("이메일은 필수입니다.").email("유효한 이메일 형식이 아닙니다."),
    phone: yup.string()
        .notRequired()
        .nullable(true)
        .transform(value => (value === '' ? null : value))
        .matches(
            /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/,
            '유효한 전화번호 형식이 아닙니다.'
        ),
});

const RegisterPage = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: { userId: '', password: '', passwordCheck: '', nickname: '', name: '', email: '', phone: '' }
    });


    const onSubmit = async (data) => {
        const { passwordCheck, ...registerData } = data;

        try {
            const response = await accountAPI.register(registerData);

            if (response && response.resultCode === "200") {
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            } else {
                alert(response.message || '회원가입 실패: 관리자에게 문의하세요.');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            alert(error.response?.data?.message || '회원가입 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className={style.container}>
            <div className={style.authBox}>
                <h2>회원가입</h2>
                <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
                    {/* 🚨 2. 각 input에 {...register("필드이름")} 적용 및 에러 메시지 표시 */}
                    <input type="text" placeholder="아이디" {...register("userId")} className={style.inputField} />
                    {errors.userId && <p className={style.errorMessage}>{errors.userId.message}</p>}

                    <input type="password" placeholder="비밀번호 (최소 8자)" {...register("password")} className={style.inputField} />
                    {errors.password && <p className={style.errorMessage}>{errors.password.message}</p>}

                    <input type="password" placeholder="비밀번호 확인" {...register("passwordCheck")} className={style.inputField} />
                    {errors.passwordCheck && <p className={style.errorMessage}>{errors.passwordCheck.message}</p>}

                    <input type="text" placeholder="닉네임" {...register("nickname")} className={style.inputField} />
                    {errors.nickname && <p className={style.errorMessage}>{errors.nickname.message}</p>}

                    <input type="text" placeholder="이름" {...register("name")} className={style.inputField} />
                    {errors.name && <p className={style.errorMessage}>{errors.name.message}</p>}

                    <input type="email" placeholder="이메일" {...register("email")} className={style.inputField} />
                    {errors.email && <p className={style.errorMessage}>{errors.email.message}</p>}

                    <input type="tel" placeholder="휴대폰 번호 (선택)" {...register("phone")} className={style.inputField} />
                    {errors.phone && <p className={style.errorMessage}>{errors.phone.message}</p>}

                    <button type="submit" className={style.submitButton}>
                        회원가입
                    </button>
                    <p className={style.linkText}>
                        이미 계정이 있으신가요? <a href="/login">로그인</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;