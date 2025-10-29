import React, {useCallback, useEffect} from 'react';
import * as yup from "yup";
import {useNavigate, useParams} from "react-router";
import {useBoard, useGetBoardDetail} from "../../customHook/useBoard.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import style from "../../assets/css/board.common.module.css";
import {useForm} from "react-hook-form";
import {useAuthStore} from "../../store/authStore.jsx";
import {BOARD_CATEGORIES} from "../../utils/constants/boardCategories.jsx";

const schema = yup.object().shape({
    category: yup.string().required("카테고리를 선택하십시오"),
    title : yup.string().required('제목을 입력하십시오'),
    contents : yup.string().required('내용을 입력하십시오')
})
const BoardUpdate = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const { updateBoardMutation } = useBoard();

    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ADMIN';

    const {
        data : initialData
    } = useGetBoardDetail(id);

    const availableCategories = isAdmin
        ? BOARD_CATEGORIES
        : BOARD_CATEGORIES.filter(cat => cat.value !== 'notice');

    const {register, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: "",
            title: "",
            contents: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                category: initialData.category,
                title: initialData.title,
                contents: initialData.contents
            });
        }
    }, [initialData, reset]);

    const quillValue = watch('contents');

    useEffect(() => {
        register('contents', {required: true});
    }, [register]);

    const handleQuillChange = useCallback((value) => {
        setValue("contents", value, {shouldValidate: true});
    }, [setValue]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const onSubmit = async (data) => {
        console.log("게시글 수정 데이터", data);

        const formData = new FormData();
        formData.append("id", id);
        formData.append("category", data.category);
        formData.append("title", data.title);
        formData.append("contents", data.contents);

        try{
            const result = await updateBoardMutation.mutateAsync(formData);

            if(result.resultCode === 200){
                alert("게시글이 수정되었습니다");
                navigate(`/board/${id}`);
            } else {
                alert("게시글 수정에 실패했습니다");
                return false;
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    const { ref : titleRef, ...restTitleProps} = register('title');
    const { ref : categoryRef, ...restCategoryProps} = register('category');

    const moveToList = () => {
        if(window.confirm("수정을 취소하고 상세 페이지로 돌아가시겠습니까?")){
            navigate(`/board/${id}`);
        }
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                게시글 수정
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
                            {availableCategories.map(category => (
                                <option key={category.value} value={category.value}>{category.label}</option>
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

                    <div className={`${style.buttonGroup}`}>
                        <button
                            type="button"
                            className={`${style.button} ${style.buttonAll}`}
                            onClick={moveToList}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className={`${style.button} ${style.buttonPrimary}`}
                        >
                            수정
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default BoardUpdate;