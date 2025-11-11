import React, {useState} from 'react';
import {useGetCommentList} from "../../customHook/useCommentHook.jsx";
import commentStyle from "../../assets/css/comment.common.module.css";
import Pagination from "../../components/Pagination.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import CommentItem from "./CommentItem.jsx";

const COMMENT_PAGE_PER_ROWS = 5;

const CommentList = ({resourceType, parentId}) => {
    const [currentPage, setCurrentPage] = useState(0);

    const {data: commentData, isLoading} = useGetCommentList(resourceType, parentId, currentPage, COMMENT_PAGE_PER_ROWS);

    const comments = commentData?.content || [];
    const totalRows = commentData?.totalElements || 0;

    const movePage = (page) => {
        if(page >= 0){
            setCurrentPage(page);
        }
    }

    if(isLoading || !comments) {
        return <div className={commentStyle.noComment}>댓글 없음</div>
    }

    return (
        <div className={commentStyle.commentContainer}>
            <h3 className={commentStyle.commentHeader}>댓글 ({totalRows})</h3>

            {(comments.length === 0 && totalRows === 0) ? (
                <div className={commentStyle.noComment}>등록된 댓글이 없습니다.</div>
            ) : (
                <ul className={commentStyle.commentList}>
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            resourceType={comment.targetType}
                            parentId={comment.targetId}
                        />
                    ))}
                </ul>
            )}

            {totalRows > COMMENT_PAGE_PER_ROWS && (
                <Pagination
                    page={currentPage}
                    totalRows={totalRows}
                    movePage={movePage}
                    pagePerRows={COMMENT_PAGE_PER_ROWS}
                    blockPerCount={5}
                />
            )}
        </div>
    );
};

export default CommentList;