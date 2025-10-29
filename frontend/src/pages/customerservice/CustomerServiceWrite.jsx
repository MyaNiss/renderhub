import React, {useCallback, useEffect} from 'react';
import * as yup from 'yup';
import {useNavigate} from "react-router";
import {useAuthStore} from "../../store/authStore.jsx";
import {yupResolver} from "@hookform/resolvers/yup";
import useQuillEditor from "../../customHook/useQuillEditor.jsx";
import {useCS} from "../../customHook/useCS.jsx";
import style from "../../assets/css/cs.common.module.css"
import {useForm} from "react-hook-form";
import {CS_CATEGORIES} from "../../utils/constants/csCategories.jsx";

const schema = yup.object().shape({
    category: yup.string().required("카테고리를 선택하십시오"),
    title : yup.string().required("제목을 입력하십시오"),
    contents : yup.string().required('내용을 입력하십시오'),
    isPrivate: yup.boolean()
});

const CustomerServiceWrite = () => {
    const navigate = useNavigate();
    const currentUserId = useAuthStore(state => state.userId);

    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: "",
            title: "",
            contents: "",
            isPrivate: false,
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

    const {createBoardMutation: createCsMutation} = useCS();

    const onSubmit = async (data) => {
        console.log("폼 데이터", data);

        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("title", data.title);
        formData.append("contents", data.contents);
        formData.append("isPrivate", data.isPrivate);
        formData.append("writerId", currentUserId);

        try {
            const result = await createCsMutation.mutateAsync(formData);

            if(result.resultCode === 200){
                navigate('/cs');
            }else{
                alert('문의글 등록에 실패하였습니다');
                return false;
            }

        } catch (error) {
            console.error("문의글 등록 중 에러:", error);
        }
    }

    const  { ref : titleRef, ...restTitleProps} = register('title');
    const {ref: categoryRef, ...restCategoryProps} = register('category');

    const writeCancel = () => {
        if(window.confirm("작성을 취소하고 목록으로 돌아가시겠습니까?")){
            navigate('/cs');
        }
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 문의 등록</h2>
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
                            {CS_CATEGORIES.map(category => (
                                <option key={category.value} value={category.value}>{category.label}</option>
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