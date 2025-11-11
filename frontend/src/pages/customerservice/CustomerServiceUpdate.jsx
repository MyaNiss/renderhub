import React, {useCallback, useEffect} from 'react';
import * as yup from 'yup';
import {useNavigate, useParams} from "react-router";
import {useAuthStore} from "../../store/authStore.jsx";
import {useCS, useGetCSDetail} from "../../customHook/useCS.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import style from "../../assets/css/cs.common.module.css";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";

const schema = yup.object().shape({
    categoryId: yup.number().typeError("카테고리를 선택하십시오").required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오"),
    content : yup.string().required('내용을 입력하십시오'),
    isSecret: yup.boolean(),
});

const CustomerServiceUpdate = () => {
    const navigate = useNavigate();
    const {id: csId} = useParams();

    const currentUserId = useAuthStore(state => state.userId);
    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ROLE_ADMIN';

    const {categories : csCategories} = useCategories(CATEGORY_TYPES.CS);

    const {data: initialData, isLoading} = useGetCSDetail(csId);

    const {updateCsMutation} = useCS();

    const {register, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryId: null,
            title: "",
            content: "",
            isSecret: false,
        }
    });

    useEffect(() => {
        if (initialData && csCategories.length > 0) {
            reset({
                categoryId: Number(initialData.categoryId),
                title: initialData.title || "",
                content: initialData.content || "",
                isSecret: initialData.isSecret || false,
            });
            
            if(initialData.writer.userId !== currentUserId && !isAdmin) {
                alert("수정 권한이 없습니다.");
                navigate(`/cs/${csId}`);
            }
        }
    }, [initialData, reset, csCategories.length]);

    const quillValue = watch('content');

    const handleQuillChange = useCallback((value) => {
        setValue("content", value, {shouldValidate: true});
    }, [setValue]);

    useEffect(() => {
        register('content', {required: true});
    }, [register]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("csId", csId);
        formData.append("categoryId", data.categoryId);
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("isSecret", data.isSecret);

        try {
            const result = await updateCsMutation.mutateAsync(formData);

            if(result.resultCode === "200"){
                alert('문의글이 수정되었습니다');
                navigate(`/cs/${csId}`);
            }else{
                alert('문의글 수정에 실패하였습니다');
            }
        } catch (error) {
            console.error("문의글 수정 중 에러:", error);
            alert('문의글 수정 중 문제가 발생했습니다.');
        }
    }

    const  { ref : titleRef, ...restTitleProps} = register('title');
    const {ref: categoryRef, ...restCategoryProps} = register('categoryId');

    const cancelUpdate = () => {
        if(window.confirm("수정을 취소하고 상세 페이지로 돌아가시겠습니까?")){
            navigate(`/cs/${csId}`);
        }
    }

    const availableCategories = isAdmin
        ? csCategories
        : csCategories.filter(cat => cat.name !== 'FAQ');

    if (!initialData) {
        return (
            <div className={style.container}>
                <div className={`${style.section} ${style.textCenter}`}>
                    <h2 className={style.header}>잘못된 접근이거나 게시글을 찾을 수 없습니다.</h2>
                </div>
            </div>
        )
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 문의 수정</h2>
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
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                            비밀글로 유지
                        </label>
                    </div>


                    {/* 5. 버튼 그룹 */}
                    <div className={`${style.flexContainer} ${style.buttonGroup}`}>
                        <button type="submit" className={`${style.button} ${style.buttonPrimary}`}>수정 완료</button>
                        <button type="button" className={`${style.button} ${style.buttonAll}`} onClick={cancelUpdate}>취소</button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CustomerServiceUpdate;