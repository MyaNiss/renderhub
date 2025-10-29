import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useComment} from "../../customHook/useCommentHook.jsx";
import commentStyle from "../../assets/css/comment.common.module.css"

const schema = yup.object().shape({
    content: yup.string().required("댓글 내용을 입력하십시오").max(500, "댓글은 500자를 넘길 수 없습니다")
});

const CommentEditForm = ({comment, resourceType, parentId, onCancel}) => {

    const {register, handleSubmit, reset, formState:{errors, isDirty} } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            content: comment.content || ""
        }
    });

    const {updateCommentMutation} = useComment();

    const onSubmit = async (data) => {
        if(!isDirty){
            onCancel();
            return;
        }

        const formData = new FormData();
        formData.append("comment", comment.content);

        try{
            const result = await updateCommentMutation.mutateAsync({
                commentId:comment.id,
                formData:formData,
                resourceType:resourceType,
                parentId:parentId
            });

            if(result.resultCode === 200){
                alert("댓글이 성공적으로 수정되었습니다");
                onCancel();
            } else{
                alert('댓글 수정에 실패했습니다');
            }
        }catch (error){
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={commentStyle.commentEditForm}>
            <div className={commentStyle.formGroup}>
                {/* 작성자 정보 */}
                <div className={commentStyle.commentMeta}>
                    <span className={commentStyle.commentWriter}>{comment.writer || '익명'}</span>
                    <span className={commentStyle.commentDate}>{comment.createdAt || 'N/A'}</span>
                    <span className={commentStyle.editingNotice}>(수정 중)</span>
                </div>

                {/* 텍스트 영역 */}
                <textarea
                    className={commentStyle.formTextarea}
                    id={`edit-content-${comment.id}`}
                    placeholder="수정할 댓글을 입력하세요..."
                    {...register('content')}
                />
                {errors.content && <p className={commentStyle.errorMessage}>{errors.content.message}</p>}
            </div>

            {/* 버튼 그룹 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                    className={commentStyle.commentButton}
                    type="submit"
                >
                    수정
                </button>
                <button
                    className={commentStyle.commentButtonSecondary}
                    type="button"
                    onClick={onCancel}
                >
                    취소
                </button>
            </div>
        </form>
    )
}

export default CommentEditForm;