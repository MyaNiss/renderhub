import * as yup from "yup";
import {useUser} from "../../customHook/useUser.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import style from "../../assets/css/user.common.module.css";

const passwordUpdateSchema = yup.object().shape({
    currentPassword: yup.string()
        .required('기존 비밀번호는 필수 입력 항목입니다.'),

    newPassword: yup.string()
        .required('새 비밀번호는 필수 입력 항목입니다.')
        .min(8, '새 비밀번호는 최소 8자 이상이어야 합니다.'),

    confirmNewPassword: yup.string()
        .required('새 비밀번호 확인은 필수 입력 항목입니다.')
        .oneOf([yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.'),
});

export const PasswordUpdate = ({ onModalClose }) => {
    const userId = useAuthStore((state) => state.userId);
    const {logout} = useAuthStore();
    const { updatePasswordMutation } = useUser(userId);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        resolver: yupResolver(passwordUpdateSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    });

    const onSubmit = async (formData) => {
        try{
            const result = await updatePasswordMutation.mutateAsync(formData);

            if(result.resultCode === "200"){
                alert("비밀번호가 성공적으로 변경되었습니다");
                logout();
            } else {
                alert(`비밀번호 변경에 실패했습니다: ${result.message}`);
            }
        } catch (error) {
            console.error("Password update error:", error);
            alert(`비밀번호 변경 중 오류 발생: ${error.message}`);
        }
        finally {
            onModalClose();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>

            <h1 className={style.formTitle}>비밀번호 변경</h1>
            <p style={{ color: 'var(--color-text-primary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                안전을 위해 기존 비밀번호를 입력해야 새 비밀번호를 설정할 수 있습니다.
            </p>

            <div className={style.formGroup}>
                <div className={style.label}>사용자 ID</div>
                <div className={style.readOnlyField} style={{ backgroundColor: 'var(--color-background-primary)' }}>
                    {userId || '로그인 필요'}
                </div>
            </div>

            <div className={style.formGroup}>
                <label htmlFor="currentPassword" className={style.label}>기존 비밀번호</label>
                <input
                    id="currentPassword"
                    type="password"
                    className={style.inputField}
                    placeholder="현재 사용 중인 비밀번호"
                    {...register("currentPassword")}
                />
                {errors.currentPassword && <p className={style.errorMessage}>{errors.currentPassword.message}</p>}
            </div>

            <div className={style.formGroup}>
                <label htmlFor="newPassword" className={style.label}>신규 비밀번호</label>
                <input
                    id="newPassword"
                    type="password"
                    className={style.inputField}
                    placeholder="새 비밀번호 (최소 8자)"
                    {...register("newPassword")}
                />
                {errors.newPassword && <p className={style.errorMessage}>{errors.newPassword.message}</p>}
            </div>

            <div className={style.formGroup}>
                <label htmlFor="confirmNewPassword" className={style.label}>신규 비밀번호 확인</label>
                <input
                    id="confirmNewPassword"
                    type="password"
                    className={style.inputField}
                    placeholder="새 비밀번호 확인"
                    {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword && <p className={style.errorMessage}>{errors.confirmNewPassword.message}</p>}
            </div>

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
                    비밀번호 변경
                </button>
            </div>
        </form>
    )

}