import React from 'react';
import {useNavigate, useParams} from "react-router";
import style from "../../assets/css/cs.common.module.css";
import CommentForm from "../comment/CommentForm.jsx";
import CommentList from "../comment/CommentList.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import {CS_CATEGORIES} from "../../utils/constants/csCategories.jsx";
import {useCS, useGetCSDetail} from "../../customHook/useCS.jsx";

const CustomerServiceDetail = () => {
    const {id: csId} = useParams();
    const navigate = useNavigate();

    const currentUserId = useAuthStore((state) => state.userId);
    const currentUserRole = useAuthStore((state) => state.userRole);
    const isAdmin = currentUserRole === 'ADMIN';

    const {deleteCsMutation} = useCS();

    const {
        data: cs, isLoading
    } = useGetCSDetail(csId);


    const moveToEdit = () => {
        navigate(`/cs/update/${csId}`);
    }

    const moveToList = () => {
        navigate('/cs');
    }

    const deleteCs = async () => {
        if (!window.confirm("정말 삭제하시겠습니까? (문의글 및 답변 모두 삭제됩니다)")) {
            return;
        }

        try {
            const result = await deleteCsMutation.mutateAsync(csId);

            if (result.resultCode === 200) {
                console.log('고객 지원 글이 삭제되었습니다');
                moveToList();
            } else {
                console.error('고객 지원 글 삭제에 실패했습니다');
            }
        } catch (error) {
            console.error('삭제 처리 중 오류 발생:', error);
            alert('삭제에 실패했습니다. 권한을 확인해주세요.');
        }
    }

    if (isLoading) {
        return (
            <div className={style.container}>
                <div className={`${style.section} ${style.textCenter}`}>
                    <h2 className={style.header}>고객 지원 정보를 불러오는 중입니다</h2>
                </div>
            </div>
        )
    }

    if (!cs) {
        return (
            <div className={style.container}>
                <div className={`${style.section} ${style.textCenter}`}>
                    <h2 className={style.header}>존재하지 않는 게시글이거나 접근 권한이 없습니다.</h2>
                    <button
                        type="button"
                        className={`${style.button} ${style.buttonAll}`}
                        onClick={moveToList}
                        style={{marginTop: '20px'}}
                    >목록으로 돌아가기</button>
                </div>
            </div>
        )
    }

    const isAuthor = cs.writer === currentUserId;
    const canManage = isAuthor || isAdmin;

    // 카테고리 라벨 표시용 (옵션: cs 객체에 category 필드가 있다고 가정)
    const categoryLabel = CS_CATEGORIES.find(c => c.value === cs.category)?.label || '기타';

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 상세</h2>
            </header>
            <section className={style.section}>
                <div className={style.formGroup}>
                    <h1 className={style.detailTitle}>[{categoryLabel}] {cs.title}</h1>
                    <div className={style.detailMetaContainer}>
                        {cs.isPrivate && <span>🔒 비밀글 </span>}
                        <span>작성자 : <span className={style.detailMetaText}>{cs.writer}</span> </span>
                        <span>등록일 : <span className={style.detailMetaText}>{cs.createDate}</span> </span>
                        <span>수정일 : <span className={style.detailMetaText}>{cs.updateDate}</span> </span>
                    </div>
                </div>

                <div className={style.formGroup}>
                    <label>문의 내용</label>
                    <div className={style.detailContentsArea}>
                        <div dangerouslySetInnerHTML={{__html: cs.contents}}></div>
                    </div>
                </div>

                <div className={`${style.buttonGroup}`}>
                    <button
                        type="button"
                        className={`${style.button} ${style.buttonAll}`}
                        onClick={moveToList}
                    >
                        목록
                    </button>
                    {/* 💡 관리자 또는 작성자에게 수정/삭제 버튼 표시 */}
                    {canManage && (
                        <>
                            <button
                                type="button"
                                className={`${style.button} ${style.buttonOutline}`}
                                onClick={moveToEdit}
                            >
                                수정
                            </button>
                            <button
                                type="button"
                                className={`${style.button} ${style.buttonDanger}`}
                                onClick={deleteCs}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </section>
            <div style={{marginTop: '40px'}}>
                <h3 style={{borderBottom: '1px solid var(--color-component-border)', paddingBottom: '10px', marginBottom: '20px'}}>답변</h3>

                {isAdmin && (
                    <CommentForm resourceType={'cs'} parentId={csId}/>
                )}

                <CommentList resourceType={'cs'} parentId={csId}/>
            </div>
        </div>
    );
};

export default CustomerServiceDetail;