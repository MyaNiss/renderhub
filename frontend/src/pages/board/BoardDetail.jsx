import React from 'react';
import {useNavigate, useParams} from "react-router";
import {useBoard, useGetBoardDetail} from "../../customHook/useBoard.jsx";
import style from "../../assets/css/board.common.module.css";
import CommentForm from "../comment/CommentForm.jsx";
import CommentList from "../comment/CommentList.jsx";
import {useAuthStore} from "../../store/authStore.jsx";

const BoardDetail = () => {
    const {id: boardId} = useParams();
    const navigate = useNavigate();

    const currentUserId = useAuthStore((state) => state.userId);

    const {deleteBoardMutation} = useBoard();

    const {
        data : board, isLoading
    } = useGetBoardDetail(boardId);

    const moveToEdit = () => {
        navigate(`/board/update/${boardId}`);
    }

    const moveToList = () => {
        navigate('/board');
    }

    const deleteBoard = async () => {
        if(!window.confirm("정말 삭제하시겠습니까?")){
            return;
        }

        try{
            const result = await deleteBoardMutation.mutateAsync(boardId);

            if(result.resultCode === 200) {
                console.log('게시글이 삭제되었습니다');
                moveToList();
            } else {
                console.error('게시글 삭제에 실패했습니다');
            }
        } catch(error) {
            console.error(error);
        }
    }

    if(isLoading){
        return (
            <div className={style.container}>
                <div className={`${style.section} ${style.textCenter}`}>
                    <h2 className={style.header}>게시글 정보를 불러오는 중입니다</h2>
                </div>
            </div>
        )
    }

    const isAuthor = board.writer === currentUserId;

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>게시글 상세</h2>
            </header>
            <section className={style.section}>
                <div className={style.formGroup}>
                    <h1 className={style.detailTitle}>{board.title}</h1>
                    <div className={style.detailMetaContainer}>
                        <span>작성자 : <span className={style.detailMetaText}>{board.writer}</span> </span>
                        <span>등록일 : <span className={style.detailMetaText}>{board.createDate}</span> </span>
                        <span>수정일 : <span className={style.detailMetaText}>{board.updateDate}</span> </span>
                    </div>
                </div>

                <div className={style.formGroup}>
                    <label>내용</label>
                    <div className={style.detailContentsArea}>
                        <div dangerouslySetInnerHTML={{__html: board.contents}}></div>
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
                    {isAuthor && (
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
                                onClick={deleteBoard}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </section>
            <div style={{marginTop: '40px'}}>
                <CommentForm resourceType={'board'} parentId={boardId}/>
                <CommentList resourceType={'board'} parentId={boardId}/>
            </div>
        </div>
    );
};

export default BoardDetail;