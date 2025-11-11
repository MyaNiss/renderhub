import React, {useCallback, useEffect} from 'react';
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/src/index.js";
import style from "../../assets/css/board.common.module.css";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import {useNavigate} from "react-router";
import {useBoard} from "../../customHook/useBoard.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";

// 유효성 처리
const schema = yup.object().shape({
    categoryId: yup.number().typeError("카테고리를 선택하십시오").required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오").max(100, "제목은 최대 100자 입니다"),
    content : yup.string().required('내용을 입력하십시오'),
});

const BoardWrite = () => {
    const navigate = useNavigate();

    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ROLE_ADMIN';

    const { categories: boardCategories } = useCategories(CATEGORY_TYPES.BOARD);
    const availableCategories = isAdmin ? boardCategories : boardCategories.filter(category => category.name !== '공지');

    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryId: null,
            title: "",
            content: ""
        }
    });

    const quillValue = watch('content');

    const handleQuillChange = useCallback((value) => {
        setValue("content", value, {shouldValidate: true});
    }, [setValue]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const {createBoardMutation} = useBoard();

    const onSubmit = async (data) => {

        const formData = new FormData();
        formData.append("categoryId", data.categoryId);
        formData.append("title", data.title);
        formData.append("content", data.content);

        try {
            const result = await createBoardMutation.mutateAsync(formData);
            console.log(result);

            alert('게시글이 등록되었습니다');
            navigate('/board');
        } catch (error) {
            console.log(error);
        }
    }

    const  { ref : titleRef, ...restTitleProps} = register('title');
    const  { ref : categoryRef, ...restCategoryProps} = register('categoryId');

    const writeCancel = () => {
        if(window.confirm("작성을 취소하고 목록으로 돌아가시겠습니까?")){
            navigate('/board');
        }
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>게시글 작성</h2>
            </header>
            <section className={style.section}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={style.formGroup}>
                        <label htmlFor="categoryId">카테고리</label>
                        <select
                            id="categoryId"
                            className={style.formInput}
                            ref={categoryRef}
                            {...restCategoryProps}
                        >
                            <option value="">-- 카테고리를 선택하세요 --</option>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className={style.errorMessage}>{errors.categoryId.message}</p>}
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            className={style.formInput}
                            placeholder="제목을 입력하십시오"
                            ref={titleRef}
                            {...restTitleProps}
                        />
                        {errors.title && <p className={style.errorMessage}>{errors.title.message}</p>}
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="content">내용</label>
                        <div className={"quill-wrapper"}>
                            {QuillEditorComponent}
                        </div>
                        <div>
                            {errors.content && <p className={style.errorMessage}>{errors.content.message}</p>}
                        </div>
                    </div>

                    <div className={`${style.flexContainer} ${style.buttonGroup}`}>
                        <button type="submit" className={`${style.button} ${style.buttonPrimary}`}>등록</button>
                        <button type="button" className={`${style.button} ${style.buttonAll}`} onClick={writeCancel}>취소</button>
                    </div>
                </form>
            </section>
        </div>

    );
};

export default BoardWrite;