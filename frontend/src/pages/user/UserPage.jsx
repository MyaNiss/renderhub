import React, {useEffect, useState} from 'react';
import style from '../../assets/css/user.common.module.css';
import {useParams} from "react-router";
import {useUser} from "../../customHook/useUser.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Pagination from "../../components/Pagination.jsx";

const contentsUpdateSchema = yup.object().shape({
    contents: yup.string()
        .max(500, '소개글은 500자 이하로 작성해 주세요.') // 예시 최대 길이
        .nullable(true),
});

const PostCard = ({ item }) => {
    return (
        <a href={`/post/${item.id}`} className={style.postCardLink}>
            <div className={`${style.idHighlight} ${style.postCardHighlight}`}>
                <div className={style.postContent} style={{ paddingLeft: '0' }}>
                    <h3 className={style.postTitle} style={{ margin: '0' }}>
                        {item.title}
                    </h3>
                </div>
            </div>
        </a>
    );
};

const BoardListItem = ({ item }) => {
    return (
        <a href={`/board/${item.id}`} className={style.postCardLink}>
            <div className={style.postCardHighlight}>
                <h3 className={style.postTitle} style={{ margin: '0' }}>
                    {item.title}
                </h3>
            </div>
        </a>
    );
};

const UserPage = () => {
    const {targetUserId} = useParams();

    const {getUserProfile, updateUserMutation} = useUser(targetUserId);

    const {data : userData} = getUserProfile;

    const currentUserId = useAuthStore(state => state.userId);

    const {
        userId = 'admin',
        nickname,
        contents,
        boardList = [],
        postList = []
    } = userData || {};

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: yupResolver(contentsUpdateSchema),
        defaultValues: {
            contents: contents || ''
        }
    });

    const [boardPage, setBoardPage] = useState(0);
    const [postPage, setPostPage] = useState(0);
    const PAGE_PER_ROWS = 5;

    const getPaginatedItems = (list, page, rowsPerPage) => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return list.slice(startIndex, endIndex);
    };

    const boardsToDisplay = getPaginatedItems(boardList, boardPage, PAGE_PER_ROWS);
    const postsToDisplay = getPaginatedItems(postList, postPage, PAGE_PER_ROWS);

    const isOwnPage = userId === currentUserId;

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if(userData){
            reset({contents: userData.contents || ''});
        }
    }, [userData, reset]);

    const handleEdit = () => {
        reset({contents: contents || ''});
        setIsEditing(true);
    };

    const handleCancel = () => {
        reset({contents: contents || ''});
        setIsEditing(false);
    }

    const onSubmitContents = async (formData) => {
        if(!isDirty){
            alert('수정된 내용이 없습니다');
            return;
        }

        try{
            const result = await updateUserMutation.mutateAsync(formData);

            if(result && result.resultCode === 200){
                setIsEditing(false);
            } else {
                alert('소개글 수정에 실패했습니다');
            }
        }catch (error){
            console.error(error);
        }
    }

    return (
        <div className="site-wrap content-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div className={`${style.userContainer} ${style.userPageContainer}`}>

                <h1 className={style.formTitle}>
                    {nickname || '알 수 없는 사용자'} 님의 프로필
                </h1>

                <section className={style.profileInfoSection}>
                    <div className={style.formGroup}><div className={style.label}>닉네임</div><div className={style.readOnlyField}>{nickname || '-'}</div></div>
                    <div className={style.formGroup}>
                        <div className={style.sectionHeader}>
                            <div className={style.label}>소개 / 컨텐츠</div>
                            {isOwnPage && !isEditing && (
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className={`${style.secondaryButton} ${style.editButton}`}
                                >
                                    수정
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <>
                                <textarea
                                    id="contents"
                                    className={style.textareaField}
                                    {...register("contents")}
                                    rows={5}
                                    placeholder="새로운 소개글을 입력하세요."
                                    disabled={updateUserMutation.isPending}
                                />
                                {errors.contents && <p className={style.errorMessage}>{errors.contents.message}</p>}

                                <div className={style.buttonGroup} style={{ marginTop: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className={style.secondaryButton}
                                        disabled={updateUserMutation.isPending}
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit(onSubmitContents)}
                                        className={style.primaryButton}
                                        disabled={updateUserMutation.isPending}
                                    >
                                        {updateUserMutation.isPending ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div
                                className={style.readOnlyField}
                                style={{ minHeight: '100px', whiteSpace: 'pre-wrap' }}
                            >
                                {contents || '등록된 내용이 없습니다.'}
                            </div>
                        )}
                    </div>
                </section>

                <div className={style.splitLayoutWrapper}>
                    {/* --- 왼쪽: 게시판 글 목록 (BoardList) --- */}
                    <section className={style.splitColumn}>
                        <h2 className={style.formTitle} style={{ fontSize: '1.5rem', marginTop: '0', marginBottom: '20px' }}>
                            작성한 게시판 글 ({boardList.length}개)
                        </h2>
                        <div className={style.boardListGrid}>
                            {boardsToDisplay.length > 0 ? (
                                boardsToDisplay.map(boardItem => (
                                    <BoardListItem key={`board-${boardItem.id}`} item={boardItem} />
                                ))
                            ) : (
                                <p className={style.noPostsMessage}>작성한 게시판 글이 없습니다.</p>
                            )}
                        </div>

                        <Pagination
                            totalRows={boardList.length}
                            page={boardPage}
                            movePage={setBoardPage}
                        />
                    </section>

                    {/* --- 오른쪽: 판매 물품 목록 (PostList) --- */}
                    <section className={style.splitColumn}>
                        <h2 className={style.formTitle} style={{ fontSize: '1.5rem', marginTop: '0', marginBottom: '20px' }}>
                            등록한 판매 물품 ({postList.length}개)
                        </h2>
                        <div className={style.postListGrid}>
                            {postsToDisplay.length > 0 ? (
                                postsToDisplay.map(postItem => (
                                    <PostCard key={`post-${postItem.id}`} item={postItem} />
                                ))
                            ) : (
                                <p className={style.noPostsMessage}>등록된 판매 물품이 없습니다.</p>
                            )}
                        </div>

                        <Pagination
                            totalRows={postList.length}
                            page={postPage}
                            movePage={setPostPage}
                        />
                    </section>
                </div>

                <div className={`${style.buttonGroup} ${style.pageButtonGroup} ${style.buttonGroupEnd}`}>
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className={style.secondaryButton}
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;