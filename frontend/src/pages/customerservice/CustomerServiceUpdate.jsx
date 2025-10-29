import React, {useCallback, useEffect} from 'react';
import * as yup from 'yup';
import {useNavigate, useParams} from "react-router";
import {useAuthStore} from "../../store/authStore.jsx";
import {useCS, useGetCSDetail} from "../../customHook/useCS.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import {CS_CATEGORIES} from "../../utils/constants/csCategories.jsx";
import style from "../../assets/css/cs.common.module.css";

const schema = yup.object().shape({
    category: yup.string().required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오"),
    contents : yup.string().required('내용을 입력하십시오'),
    isPrivate: yup.boolean(),
});

const CustomerServiceUpdate = () => {
    const navigate = useNavigate();
    const {id: csId} = useParams();

    const currentUserId = useAuthStore(state => state.userId);
    const currentUserRole = useAuthStore(state => state.userRole);
    const isAdmin = currentUserRole === 'ADMIN';

    const {data: initialData} = useGetCSDetail(csId);

    const {updateCsMutation} = useCS();

    const {register, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: "",
            title: "",
            contents: "",
            isPrivate: false,
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                category: initialData.category || "",
                title: initialData.title || "",
                contents: initialData.contents || "",
                isPrivate: initialData.isPrivate || false,
            });
            
            if(initialData.writer !== currentUserId && !isAdmin) {
                alert("수정 권한이 없습니다.");
                navigate(`/cs/${csId}`);
            }
        }
    }, [initialData, reset]);

    const quillValue = watch('contents');

    const handleQuillChange = useCallback((value) => {
        setValue("contents", value, {shouldValidate: true});
    }, [setValue]);

    useEffect(() => {
        register('contents', {required: true});
    }, [register]);

    const QuillEditorComponent = useQuillEditor(quillValue, handleQuillChange);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("id", csId);
        formData.append("category", data.category);
        formData.append("title", data.title);
        formData.append("contents", data.contents);
        formData.append("isPrivate", data.isPrivate);

        try {
            const result = await updateCsMutation.mutateAsync(formData);

            if(result.resultCode === 200){
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
    const {ref: categoryRef, ...restCategoryProps} = register('category');

    const cancelUpdate = () => {
        if(window.confirm("수정을 취소하고 상세 페이지로 돌아가시겠습니까?")){
            navigate(`/cs/${csId}`);
        }
    }

    const availableCategories = isAdmin
        ? CS_CATEGORIES
        : CS_CATEGORIES.filter(cat => cat.value !== 'faq');

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 문의 수정</h2>
            </header>
            <section className={style.section}>
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* 1. 카테고리 선택 */}
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
                        <label htmlFor="contents">내용</label>
                        <div className={"quill-wrapper"}>
                            {QuillEditorComponent}
                        </div>
                        <div>
                            {errors.contents && <p className={style.errorMessage}>{errors.contents.message}</p>}
                        </div>
                    </div>

                    {/* 4. 비밀글 설정 */}
                    <div className={style.formGroup}>
                        <label className={style.checkboxLabel}>
                            <input
                                type="checkbox"
                                id="isPrivate"
                                {...register('isPrivate')}
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