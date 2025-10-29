import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {useAuthStore} from "../../store/authStore.jsx";
import {useUser} from "../../customHook/useUser.jsx";
import style from "../../assets/css/user.common.module.css";
import {PasswordUpdate} from "./PasswordUpdate.jsx";
import {ReAuthenticateModal} from "../../components/ReAuthenticateModal.jsx";

const UserProfile = () => {

    const navigate = useNavigate();

    const userId = useAuthStore((state) => state.userId);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const {getUserProfile, deleteUserMutation} = useUser();

    const {data: userData} = getUserProfile;

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const openPasswordModal = useCallback(() => setIsPasswordModalOpen(true), []);
    const closePasswordModal = useCallback(() => setIsPasswordModalOpen(false), []);

    const [isReAuthModalOpen, setIsReAuthModalOpen] = useState(false);
    const [actionToPerform, setActionToPerform] = useState(null);

    const openReAuthModal = useCallback((action) => {
        setActionToPerform(action);
        setIsReAuthModalOpen(true);
    }, []);
    const closeReAuthModal = useCallback(() => {
        setIsReAuthModalOpen(false);
        setActionToPerform(null);
    }, []);

    const reAuthSuccess = () => {
        closeReAuthModal();

        if(actionToPerform === 'update') {
            navigate('/user/profile/update');
        } else if (actionToPerform === 'delete') {
            deleteUser();
        }
    }

    const moveToUpdate = () => {
        openReAuthModal('update');
    }

    const deleteUser = async () => {
        if (!window.confirm("정말 회원 탈퇴를 진행하시겠습니까? 모든 정보는 삭제되며 복구할 수 없습니다.")) {
            return;
        }

        try {
            await deleteUserMutation.mutateAsync();
            clearAuth();
            navigate('/');

        } catch (error) {
            console.error("Delete user failed in component:", error);
        }
    };

    const {
        nickname,
        name,
        gender,
        email,
        phone,
        bank,
        accountNumber
    } = userData || {};

    return (
        <div className="site-wrap content-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div className={style.userContainer}>

                <h1 className={style.formTitle}>
                    개인정보 조회
                </h1>
                <p style={{ color: 'var(--color-text-primary)', marginBottom: '30px', fontSize: '0.9rem' }}>
                    회원님의 현재 등록된 정보를 확인합니다.
                </p>

                {/* 1. 아이디 (ID) - 특별 강조 스타일 */}
                <div className={style.readOnlyField} style={{ marginBottom: '30px', padding: '15px', borderLeft: '4px solid var(--color-accent-primary)', backgroundColor: 'var(--color-card-bg)' }}>
                    <div className={style.label} style={{ marginBottom: '5px' }}>아이디 (ID)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{userId}</div>
                </div>

                <div className={`${style.formGroup} ${style.passwordGroup}`}>
                    <div className={style.label}>비밀번호</div>
                    <div className={style.passwordButtonContainer}>

                        <div className={`${style.readOnlyField} ${style.passwordReadOnly}`}>
                            **************
                        </div>
                        <button
                            type="button"
                            onClick={openPasswordModal}
                            className={style.secondaryButton}
                            style={{ width: 'auto', padding: '8px 15px', whiteSpace: 'nowrap', margin: 0 }}
                        >
                            비밀번호 변경
                        </button>
                    </div>
                </div>

                {/* 2. 닉네임 (Nickname) */}
                <div className={style.formGroup}>
                    <div className={style.label}>닉네임</div>
                    <div className={style.readOnlyField}>{nickname || '-'}</div>
                </div>

                {/* 3. 이름 (Name) */}
                <div className={style.formGroup}>
                    <div className={style.label}>이름</div>
                    <div className={style.readOnlyField}>{name || '-'}</div>
                </div>

                {/* 4. 성별 (Gender) */}
                <div className={style.formGroup}>
                    <div className={style.label}>성별</div>
                    <div className={style.readOnlyField}>{gender || '-'}</div>
                </div>

                {/* 5. 이메일 (Email) */}
                <div className={style.formGroup}>
                    <div className={style.label}>이메일</div>
                    <div className={style.readOnlyField}>{email || '-'}</div>
                </div>

                {/* 6. 전화번호 (Phone) */}
                <div className={style.formGroup}>
                    <div className={style.label}>전화번호</div>
                    <div className={style.readOnlyField}>{phone || '-'}</div>
                </div>

                {/* 7. 은행 및 계좌번호 (Bank & Account) */}
                <div className={style.formGroup}>
                    <div className={style.label}>은행 / 계좌번호</div>
                    <div className={style.readOnlyField}>
                        {`${bank || ''} ${accountNumber ? ' / ' + accountNumber : ''}`.trim() || '-'}
                    </div>
                </div>

                <div className={style.dangerZone} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>계정 삭제 (영구 삭제)</span>
                    <button
                        type="button"
                        onClick={() => openReAuthModal('delete')}
                        className={style.deleteButton}
                    >
                        회원 탈퇴
                    </button>
                </div>

                <div className={`${style.buttonGroup} ${style.buttonGroupEnd}`}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={style.secondaryButton}
                    >
                        뒤로가기
                    </button>

                    <button
                        type="button"
                        onClick={moveToUpdate}
                        className={style.primaryButton}
                    >
                        정보 수정
                    </button>
                </div>
            </div>
            {isPasswordModalOpen && (
                <div className={style.modalOverlay} onClick={closePasswordModal}>

                    <div
                        className={style.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <button
                            onClick={closePasswordModal}
                            className={style.modalCloseButton}
                        >
                            &times;
                        </button>

                        <PasswordUpdate onModalClose={closePasswordModal} />
                    </div>
                </div>
            )}
            {isReAuthModalOpen && (
                <div className={style.modalOverlay} onClick={closeReAuthModal}>
                    <div
                        className={style.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeReAuthModal}
                            className={style.modalCloseButton}
                        >
                            &times;
                        </button>
                        <ReAuthenticateModal
                            onModalClose={closePasswordModal}
                            onSuccess={reAuthSuccess}
                            action={actionToPerform}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;