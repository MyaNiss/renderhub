import React, {useState} from 'react';
import {useAuthStore} from "../../store/authStore.jsx";
import {useComment} from "../../customHook/useCommentHook.jsx";
import commentStyle from "../../assets/css/comment.common.module.css";
import CommentEditForm from "./CommentEditForm.jsx";

const CommentItem = ({comment, resourceType, parentId}) => {

    const currentUserId = useAuthStore((state) => state.userId);
    const { deleteCommentMutation } = useComment();

    const [isEditing, setEditing] = useState(false);
    const isAuthor = comment.writer === currentUserId;

    const handleDeleteComment = async () => {
        if(window.confirm("댓글을 삭제하시겠습니까?")){
            await deleteCommentMutation.mutateAsync({
                commentId: comment.id,
                resourceType: resourceType,
                parentId: parentId
            });
        }
    };

    const handleEditClick = () => {
        setEditing(true);
    }
    const handleCancelEdit = () => {
        setEditing(false);
    }

    if(isEditing){
        return (
            <li className={commentStyle.commentItem}>
                <CommentEditForm
                    comment={comment}
                    resourceType={resourceType}
                    parentId={parentId}
                    onCancel={handleCancelEdit}
                />
            </li>
        )
    }

    return (
        <li className={commentStyle.commentItem}>
            <div className={commentStyle.commentMeta}>
                <span className={commentStyle.commentWriter}>{comment.writer || '익명'}</span>
                <span className={commentStyle.commentDate}>{comment.createdAt || 'N/A'}</span>
            </div>

            <p className={commentStyle.commentContent}>{comment.content}</p>

            {/* 수정/삭제 버튼 표시 (작성자일 경우에만) */}
            {isAuthor && (
                <div className={commentStyle.commentActions}>
                    <button
                        style={{
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                        }}
                        onClick={handleEditClick}
                    >
                        수정
                    </button>
                    <button
                        style={{
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                            backgroundColor: 'var(--color-danger)',
                            color: 'white',
                            marginLeft: '10px'
                        }}
                        onClick={handleDeleteComment}
                    >
                        삭제
                    </button>
                </div>
            )}
        </li>
    );
};

export default CommentItem;