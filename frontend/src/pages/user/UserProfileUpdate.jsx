import * as yup from 'yup';
import style from "../../assets/css/user.common.module.css";
import {useNavigate} from "react-router";
import {useUser} from "../../customHook/useUser.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect} from "react";
import {useAuthStore} from "../../store/authStore.jsx";

const userUpdateSchema = yup.object().shape({
    nickname: yup.string()
        .required('닉네임은 필수 입력 항목입니다.')
        .min(2, '닉네임은 최소 2자 이상이어야 합니다.'),

    name: yup.string()
        .required('이름은 필수 입력 항목입니다.'),

    // gender: yup.string()
    //     .required('성별을 선택해 주세요.'),

    email: yup.string()
        .email('유효한 이메일 형식이 아닙니다.')
        .required('이메일은 필수 입력 항목입니다.'),

    phone: yup.string()
        .matches(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/, '유효한 휴대폰 번호 형식이 아닙니다. (하이픈 포함 필수: 01X-XXXX-XXXX)')
        .nullable(true),

    bankName: yup.string()
        .nullable(true),

    accountNumber: yup.string()
        .nullable(true),

    accountHolder: yup.string()
        .nullable(true)
});

const UserProfileUpdate = () => {
    const navigate = useNavigate();
    const userId = useAuthStore(state => state.userId);

    const { getUserProfile, updateUserMutation } = useUser(userId, false);
    const { data: userData } = getUserProfile;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: yupResolver(userUpdateSchema)
    });

    useEffect(() => {
        if (userData) {
            reset(userData.content);
        }
    }, [userData, reset]);

    const onSubmit = async (formData) => {
        if (!isDirty) {
            alert('수정된 내용이 없습니다.');
            return;
        }
        const dataToSend = {
            ...formData,
            userId: userId
        }

        try{
            const result = await updateUserMutation.mutateAsync(dataToSend);

            if(result.resultCode === "200"){
                navigate(`/user/profile`);
            } else {
                alert("수정에 실패했습니다");
                return false;
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="site-wrap content-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <form onSubmit={handleSubmit(onSubmit)} className={style.userContainer}>

                <h1 className={style.formTitle}>회원 정보 수정</h1>
                <p style={{ color: 'var(--color-text-primary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                    수정할 정보를 입력하고 저장해 주세요.
                </p>

                <div className={style.formGroup}>
                    <div className={style.label}>아이디 (ID)</div>
                    <div className={style.readOnlyField} style={{ backgroundColor: 'var(--color-background-primary)' }}>
                        {userId || 'N/A'}
                    </div>
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="nickname" className={style.label}>닉네임</label>
                    <input
                        id="nickname"
                        type="text"
                        className={style.inputField}
                        {...register("nickname")}
                    />
                    {errors.nickname && <p className={style.errorMessage}>{errors.nickname.message}</p>}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="name" className={style.label}>이름</label>
                    <input
                        id="name"
                        type="text"
                        className={style.inputField}
                        {...register("name")}
                    />
                    {errors.name && <p className={style.errorMessage}>{errors.name.message}</p>}
                </div>

                {/*<div className={style.formGroup}>*/}
                {/*    <div className={style.label}>성별</div>*/}
                {/*    <div className={style.radioGroup}>*/}
                {/*        <label htmlFor="gender_male" className={style.radioLabel}>*/}
                {/*            <input*/}
                {/*                id="gender_male"*/}
                {/*                type="radio"*/}
                {/*                value="male"*/}
                {/*                className={style.radioInput}*/}
                {/*                {...register("gender")}*/}
                {/*            />*/}
                {/*            남성*/}
                {/*        </label>*/}
                {/*        <label htmlFor="gender_female" className={style.radioLabel}>*/}
                {/*            <input*/}
                {/*                id="gender_female"*/}
                {/*                type="radio"*/}
                {/*                value="female"*/}
                {/*                className={style.radioInput}*/}
                {/*                {...register("gender")}*/}
                {/*            />*/}
                {/*            여성*/}
                {/*        </label>*/}
                {/*    </div>*/}
                {/*    {errors.gender && <p className={style.errorMessage} style={{ marginTop: '5px' }}>{errors.gender.message}</p>}*/}
                {/*</div>*/}

                <div className={style.formGroup}>
                    <label htmlFor="email" className={style.label}>이메일</label>
                    <input
                        id="email"
                        type="email"
                        className={style.inputField}
                        {...register("email")}
                    />
                    {errors.email && <p className={style.errorMessage}>{errors.email.message}</p>}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="phone" className={style.label}>전화번호</label>
                    <input
                        id="phone"
                        type="text"
                        className={style.inputField}
                        placeholder="010-1234-5678"
                        {...register("phone")}
                    />
                    {errors.phone && <p className={style.errorMessage}>{errors.phone.message}</p>}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="bankName" className={style.label}>은행</label>
                    <input
                        id="bankName"
                        type="text"
                        className={style.inputField}
                        placeholder="은행명"
                        {...register("bankName")}
                    />
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="accountNumber" className={style.label}>계좌번호</label>
                    <input
                        id="accountNumber"
                        type="text"
                        className={style.inputField}
                        placeholder="계좌번호"
                        {...register("accountNumber")}
                    />
                    {errors.accountNumber && <p className={style.errorMessage}>{errors.accountNumber.message}</p>}
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="accountHolder" className={style.label}>예금주</label>
                    <input
                        id="accountHolder"
                        type="text"
                        className={style.inputField}
                        placeholder="예금주"
                        {...register("accountHolder")}
                    />
                </div>

                <div className={style.buttonGroup} style={{ justifyContent: 'flex-end', marginTop: '30px' }}>
                    <button
                        type="button"
                        className={style.secondaryButton}
                        onClick={() => navigate('/user/profile')}
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className={style.primaryButton}
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileUpdate;