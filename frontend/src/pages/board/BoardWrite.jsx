import React, {useCallback, useEffect} from 'react';
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/src/index.js";
import style from "../../assets/css/board.common.module.css";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import {useNavigate} from "react-router";
import {useBoard} from "../../customHook/useBoard.jsx";
import {BOARD_CATEGORIES} from "../../utils/constants/boardCategories.jsx";
import {useAuthStore} from "../../store/authStore.jsx";

// 유효성 처리
const schema = yup.object().shape({
    category: yup.string().required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오"),
    contents : yup.string().required('내용을 입력하십시오'),
});

const BoardWrite = () => {
    const navigate = useNavigate();

    const currentUserRole = useAuthStore(state => state.userRole);
    const currentUserId = useAuthStore(state => state.userId);
    const isAdmin = currentUserRole === 'ROLE_ADMIN';

    const availableCategories = isAdmin ? BOARD_CATEGORIES : BOARD_CATEGORIES.filter(category => category.value !== 'notice');

    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: "",
            title: "",
            contents: ""
        }
    });

    const quillValue = watch('contents');

    const handleQuillChange = useCallback((value) => {
        setValue("contents", value, {shouldValidate: true});
    }, [setValue]);

    useEffect(() => {
        register('contents', {required: true});
    }, [register]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const {createBoardMutation} = useBoard();

    const onSubmit = async (data) => {
        console.log("폼 데이터", data);

        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("title", data.title);
        formData.append("contents", data.contents);

        try {
            const result = await createBoardMutation.mutateAsync(formData);
            console.log(result);

            if(result.resultCode === 200){
                alert('게시글이 등록되었습니다');
                navigate('/board');
            }else{
                alert('게시글 등록에 실패하였습니다');
                return false;
            }

        } catch (error) {
            console.log(error);
        }
    }

    const  { ref : titleRef, ...restTitleProps} = register('title');
    const  { ref : categoryRef, ...restCategoryProps} = register('category');

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
                        <label htmlFor="category">카테고리</label>
                        <select
                            id="category"
                            className={style.formInput}
                            ref={categoryRef}
                            {...restCategoryProps}
                        >
                            <option value="">-- 카테고리를 선택하세요 --</option>
                            {availableCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        {errors.category && <p className={style.errorMessage}>{errors.category.message}</p>}
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
                        <label htmlFor="contents">내용</label>
                        <div className={"quill-wrapper"}>
                            {QuillEditorComponent}
                        </div>
                        <div>
                            {errors.contents && <p className={style.errorMessage}>{errors.contents.message}</p>}
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