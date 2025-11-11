import React, {useCallback, useEffect} from 'react';
import * as yup from "yup";
import {useNavigate, useParams} from "react-router";
import {useBoard, useGetBoardDetail} from "../../customHook/useBoard.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import style from "../../assets/css/board.common.module.css";
import {useForm} from "react-hook-form";
import {useAuthStore} from "../../store/authStore.jsx";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";

const schema = yup.object().shape({
    categoryId: yup.number().typeError("카테고리를 선택하십시오").required("카테고리를 선택하십시오"),
    title : yup.string().required('제목을 입력하십시오'),
    content : yup.string().required('내용을 입력하십시오')
})
const BoardUpdate = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const { updateBoardMutation } = useBoard();

    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ROLE_ADMIN';

    const { categories: boardCategories } = useCategories(CATEGORY_TYPES.BOARD);

    const {
        data : initialData,
        isLoading,
        isError,
        error
    } = useGetBoardDetail(id);

    const availableCategories = isAdmin
        ? boardCategories
        : boardCategories.filter(cat => cat.name !== '공지');

    const {register, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryId: null,
            title: "",
            content: ""
        }
    });

    useEffect(() => {
        if (initialData && boardCategories.length > 0) {
            reset({
                categoryId: Number(initialData.categoryId),
                title: initialData.title,
                content: initialData.content
            });
        }
    }, [initialData, reset, boardCategories.length]);

    const quillValue = watch('content');

    const handleQuillChange = useCallback((value) => {
        setValue("content", value, {shouldValidate: true});
    }, [setValue]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const onSubmit = async (data) => {
        console.log("게시글 수정 데이터", data);

        const formData = new FormData();
        formData.append("boardId", id);
        formData.append("categoryId", data.categoryId);
        formData.append("title", data.title);
        formData.append("content", data.content);

        try{
            const result = await updateBoardMutation.mutateAsync(formData);
            if(result.resultCode === "200") {
                alert("게시글이 수정되었습니다");
                navigate(`/board/${id}`);
            } else {
                console.error('게시글 수정에 실패했습니다');
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    const { ref : titleRef, ...restTitleProps} = register('title');
    const { ref : categoryRef, ...restCategoryProps} = register('categoryId');

    const moveToList = () => {
        if(window.confirm("수정을 취소하고 상세 페이지로 돌아가시겠습니까?")){
            navigate(`/board/${id}`);
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

    if (!initialData) {
        return <div className={style.container}>
            <div className={`${style.section} ${style.textCenter}`}>
                <h2 className={style.header}>게시글 정보를 찾을 수 없습니다</h2>
            </div>
        </div>
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
                            defaultValue={initialData?.categoryId || ""}
                        >
                            <option value="">-- 카테고리를 선택하세요 --</option>
                            {availableCategories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
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
                        <label htmlFor="content">내용</label>
                        <div className={"quill-wrapper"}>
                            {QuillEditorComponent}
                        </div>
                        <div>
                            {errors.content && <p className={style.errorMessage}>{errors.content.message}</p>}
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