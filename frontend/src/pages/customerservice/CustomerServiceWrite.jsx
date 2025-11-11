import React, {useCallback, useEffect} from 'react';
import * as yup from 'yup';
import {useNavigate} from "react-router";
import {useAuthStore} from "../../store/authStore.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import {useCS} from "../../customHook/useCS.jsx";
import style from "../../assets/css/cs.common.module.css"
import {useForm} from "react-hook-form";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";

const schema = yup.object().shape({
    categoryId: yup.number().typeError("카테고리를 선택하십시오").required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오"),
    content : yup.string().required('내용을 입력하십시오'),
    isSecret: yup.boolean()
});

const CustomerServiceWrite = () => {
    const navigate = useNavigate();
    const currentUserId = useAuthStore(state => state.userId);
    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ROLE_ADMIN';

    const { categories: csCategories } = useCategories(CATEGORY_TYPES.CS);

    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryId: null,
            title: "",
            content: "",
            isSecret: false,
        }
    });

    const quillValue = watch('content');

    const handleQuillChange = useCallback((value) => {
        setValue("content", value, {shouldValidate: true});
    }, [setValue]);

    useEffect(() => {
        register('content', {required: true});
    }, [register]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const {writeCsMutation} = useCS();

    const onSubmit = async (data) => {
        console.log("폼 데이터", data);

        const formData = new FormData();
        formData.append("categoryId", data.categoryId);
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("isSecret", data.isSecret);

        try {
            const result = await writeCsMutation.mutateAsync(formData);

            alert("게시글이 등록되었습니다");
            navigate('/cs');

        } catch (error) {
            console.error("문의글 등록 중 에러:", error);
        }
    }

    const  { ref : titleRef, ...restTitleProps} = register('title');
    const {ref: categoryRef, ...restCategoryProps} = register('categoryId');

    const writeCancel = () => {
        if(window.confirm("작성을 취소하고 목록으로 돌아가시겠습니까?")){
            navigate('/cs');
        }
    }

    const availableCategories = isAdmin
        ? csCategories
        : csCategories.filter(cat => cat.name !== 'FAQ');

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 문의 등록</h2>
            </header>
            <section className={style.section}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* 1. 카테고리 선택 */}
                    <div className={style.formGroup}>
                        <label htmlFor="categoryId">카테고리</label>
                        <select
                            id="categoryId"
                            className={style.formInput}
                            ref={categoryRef}
                            {...restCategoryProps}
                        >
                            <option value="">-- 카테고리를 선택하세요 --</option>
                            {availableCategories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className={style.errorMessage}>{errors.categoryId.message}</p>}
                    </div>


                    {/* 2. 제목 입력 */}
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

                    {/* 3. 내용 입력 (Quill Editor) */}
                    <div className={style.formGroup}>
                        <label htmlFor="content">내용</label>
                        <div className={"quill-wrapper"}>
                            {QuillEditorComponent}
                        </div>
                        <div>
                            {errors.content && <p className={style.errorMessage}>{errors.content.message}</p>}
                        </div>
                    </div>

                    {/* 4. 비밀글 설정 */}
                    <div className={style.formGroup}>
                        <label className={style.checkboxLabel}>
                            <input
                                type="checkbox"
                                id="isSecret"
                                {...register('isSecret')}
                                style={{marginRight: '8px'}}
                            />
                            비밀글로 등록
                        </label>
                    </div>


                    {/* 5. 버튼 그룹 */}
                    <div className={`${style.flexContainer} ${style.buttonGroup}`}>
                        <button type="submit" className={`${style.button} ${style.buttonPrimary}`}>등록</button>
                        <button type="button" className={`${style.button} ${style.buttonAll}`} onClick={writeCancel}>취소</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CustomerServiceWrite;