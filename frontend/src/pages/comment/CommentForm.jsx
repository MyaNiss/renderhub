import React from 'react';
import * as yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useComment} from "../../customHook/useCommentHook.jsx";
import commentStyle from "../../assets/css/comment.common.module.css";
import boardStyle from "../../assets/css/board.common.module.css";

const schema = yup.object().shape({
    content: yup.string().required("댓글 내용을 입력하십시오").max(500, "댓글은 500자를 넘길 수 없습니다")
});

const CommentForm = ({resourceType, parentId}) => {
    const {register, handleSubmit, reset, formState:{errors} } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            content: ""
        }
    });

    const { writeCommentMutation } = useComment();

    const onSubmit = async (data) => {
        const requestBody = {
            content: data.content
        };

        try{
            const result = await writeCommentMutation.mutateAsync({
                resourceType,
                parentId,
                requestBody
            });

            if(result.resultCode === 200){
                alert('댓글이 성공적으로 작성되었습니다');
                reset();
            } else {
                alert('댓글 작성에 실패했습니다');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={commentStyle.commentFormSection} style={{ border: '1px solid var(--color-component-border)', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '15px'}}>댓글 작성</h3>

            <div className={commentStyle.formGroup}>
                <textarea className={boardStyle.formInput}
                    id="content"
                    placeholder="댓글을 입력하세요..."
                    {...register('content')}
                />
                {errors.content && <p className={commentStyle.errorMessage}>{errors.content.message}</p>}
            </div>

            <div className={boardStyle.buttonGroup}>
                <button className={boardStyle.button}
                    type="submit"
                >
                    댓글 등록
                </button>
            </div>
        </form>
    );
};

export default CommentForm;