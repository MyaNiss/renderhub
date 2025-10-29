import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import style from "../assets/css/user.common.module.css";
import {useReAuthenticate} from "../customHook/useReAuthenticate.jsx";


const reAuthSchema = yup.object().shape({
    currentPassword: yup.string().required('비밀번호를 입력해 주세요'),
});

export const ReAuthenticateModal = ({ onModalClose, onSuccess, action }) => {
    const {reAuthenticationMutation} = useReAuthenticate();

    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver: yupResolver(reAuthSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        try{
            const result = await reAuthenticationMutation.mutateAsync(data.currentPassword);

            if(result.resultCode === 200) {
                console.log('비밀번호가 맞습니다')
                onSuccess();
                onModalClose();
            } else{
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const title = action === 'update' ? '정보 수정을 위한 비밀번호 확인' :
        action === 'delete' ? '회원 탈퇴를 위한 비밀번호 확인' :
            '비밀번호 확인';

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', padding: '30px' }}>

            <h2 className={style.formTitle} style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
                {title}
            </h2>
            <p className={style.subText}>
                보안을 위해 현재 비밀번호를 다시 한번 입력해 주세요.
            </p>

            {/* 현재 비밀번호 입력 필드 */}
            <div className={style.formGroup}>
                <label htmlFor="currentPassword" className={style.label}>현재 비밀번호</label>
                <input
                    id="currentPassword"
                    type="password"
                    className={style.inputField}
                    {...register("currentPassword")}
                    placeholder="현재 비밀번호를 입력해 주세요"
                    autoFocus
                />
                {errors.currentPassword && (
                    <p className={style.errorMessage}>{errors.currentPassword.message}</p>
                )}
            </div>

            {/* 버튼 그룹 */}
            <div className={style.buttonGroup} style={{ justifyContent: 'flex-end', marginTop: '30px' }}>
                <button
                    type="button"
                    className={style.secondaryButton}
                    onClick={onModalClose}
                >
                    취소
                </button>

                <button
                    type="submit"
                    className={style.primaryButton}
                >
                    확인
                </button>
            </div>
        </form>
    )
}