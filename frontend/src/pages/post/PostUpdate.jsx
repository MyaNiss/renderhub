import React, { useState, useEffect } from "react";
import style from "../../assets/css/post.common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {useNavigate, useParams} from "react-router";
import {usePost, usePostDetail} from "../../customHook/usePost.jsx";
import {usePostForm} from "../../customHook/usePostForm.jsx";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    TouchSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    rectIntersection
} from "@dnd-kit/core";
import {Controller} from "react-hook-form";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";

const SortableImageItem = ({ item, index, isExisting, onDeleteExisting, onDeleteNew, localStyle }) => {

    const src = isExisting ? item : URL.createObjectURL(item);
    const id = isExisting ? `exist-${index}` : `new-${index}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const itemStyle = {
        transition,
        transform: CSS.Transform.toString(transform),
        display: 'inline-block',
        marginRight: '10px',
        touchAction: 'none',
        cursor: 'grab',
    };

    const handleDelete = () => {
        if (isExisting) {
            onDeleteExisting(index);
        } else {
            onDeleteNew(index);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={itemStyle}
            {...attributes}
            {...listeners}
            className={style.imageItem}
        >
            <img
                src={src}
                alt={`preview-${index}`}
                className={style.imagePreview}
            />
            <button
                type="button"
                className={style.removeImageButton}
                onClick={handleDelete}
                onPointerDown={(e) => e.stopPropagation()}
            >
                ✕
            </button>
        </div>
    );
};

const PostUpdate = () => {
    const navigate = useNavigate();
    const { id: postId } = useParams();

    const { data: existingPost, isLoading, isError } = usePostDetail(postId);

    const { categories } = useCategories(CATEGORY_TYPES.POST);
    const { categories: fileTypes } = useCategories(CATEGORY_TYPES.POST_FILE);

    const {
        control, register, handleSubmit, errors,
        allImageItems, handleDragEnd,
        existingImageUrls, newImages, existingFile, newFile,
        handleImageUpload, handleDeleteExistingImage, handleDeleteNewImage,
        handleFileUpload, handleDeleteExistingFile, handleDeleteNewFile,
    } = usePostForm(existingPost);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5
            },
            }),
    useSensor(KeyboardSensor));

    const { updatePostMutation } = usePost();


    const onValidSubmit = async (data) => {
        const formData = new FormData();

        const shouldKeepFile = !!existingFile && !newFile;

        const postData = {
            title: data.title,
            price: data.price,
            content: data.content,
            categoryId: data.categoryId,
            fileTypeId: data.fileTypeId,
            existingImageUrls: existingImageUrls,
            keepExistingFile: shouldKeepFile
        }

        const postBlob = new Blob([JSON.stringify(postData)], {
            type: "application/json",
        })

        formData.append(
            "post", postBlob
        )

        newImages.forEach((image) => {
            formData.append("imageFiles", image);
        });

        if(newFile){
            formData.append("productFile", newFile);
        }

        try{
            await updatePostMutation.mutateAsync({
                postId: postId,
                updateData: formData,
            });

            navigate(`/post/${postId}`);

        } catch (error) {
            console.error("게시물 수정 최종 실패 ", error);
        }
    }

    const handleCancel = () => {
        if(window.confirm("수정을 취소하시겠습니까?")){
            navigate(`/post/${postId}`);
        }
    }

    if (isLoading) return <div className={style.container}>데이터를 불러오는 중...</div>;
    if (isError || !existingPost) return <div className={style.container}>게시물 조회에 실패했습니다.</div>;

    const itemIds = allImageItems.map(item => item.id);


    return (
        <div className={style.container}>
            <div className={style.contents}>
                <header className={style.postHeader}>
                    <h2 className={style.postTitle}>게시물 수정: {existingPost.title}</h2>
                </header>

                <form className={style.postForm} onSubmit={handleSubmit(onValidSubmit)}>

                    <div className={style.formGroup}>
                        <label>제목</label>
                        <input type="text" {...register("title")} className={style.inputField} />
                        {errors.title && <p className={style.errorText}>{errors.title.message}</p>}
                    </div>

                    <div className={style.formGroup}>
                        <label>가격</label>
                        <input type="number" {...register("price", { valueAsNumber: true })} className={style.inputField} min="0" />
                        {errors.price && <p className={style.errorText}>{errors.price.message}</p>}
                    </div>

                    <div className={style.formGroup}>
                        <label>카테고리</label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <select {...field} className={style.selectField}>
                                    <option value="">카테고리를 선택하세요</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.categoryId && <p className={style.errorText}>{errors.categoryId.message}</p>}
                    </div>

                    {/* 파일 형식 선택 */}
                    <div className={style.formGroup}>
                    <label>파일 형식</label>
                    <Controller
                        name="fileTypeId"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className={style.selectField}>
                                <option value="">파일 형식을 선택하세요</option>
                                {fileTypes?.map((type) => (
                                    <option key={type.id} value={String(type.id)}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                        {errors.fileTypeId && <p className={style.errorText}>{errors.fileTypeId.message}</p>}
                    </div>

                    <div className={style.formGroup}>
                        <label>이미지 업로드 (드래그하여 순서 변경 가능)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={style.fileInput}
                        />

                        {/* DND Context 시작 */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={rectIntersection}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={itemIds}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className={style.imagePreviewWrapper}>
                                    {/* 💡 allImageItems 배열을 순회하며 SortableImageItem 렌더링 */}
                                    {allImageItems.map((item, idx) => {
                                        const isExisting = item.type === 'url';

                                        return (
                                            <SortableImageItem
                                                key={item.id}
                                                item={item.content}
                                                index={idx}
                                                isExisting={isExisting}
                                                onDeleteExisting={handleDeleteExistingImage}
                                                onDeleteNew={handleDeleteNewImage}
                                            />
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {/* DND Context 끝 */}
                    </div>

                    {/* 제품 설명 */}
                    <div className={style.formGroup}>
                        <label>제품 설명</label>
                        <textarea
                            {...register("content")}
                            placeholder="제품에 대한 상세 설명을 작성하세요"
                            className={style.textareaField}
                            rows="6"
                        ></textarea>
                        {errors.content && <p className={style.errorText}>{errors.content.message}</p>}
                    </div>

                    {/* 파일 업로드 */}
                    <div className={style.formGroup}>
                        <label>첨부 파일 (모델 파일)</label>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className={style.fileInput}
                        />
                        <ul className={style.fileList}>
                            {existingFile && (
                                <li key="existing-file">
                                    📎 **{existingFile.name}** (기존 파일)
                                    <button type="button" className={style.removeFileButton} onClick={handleDeleteExistingFile}>✕</button>
                                </li>
                            )}
                            {newFile && (
                                <li key="new-file">
                                    📎 **{newFile.name}** (새 파일)
                                    <button type="button" className={style.removeFileButton} onClick={handleDeleteNewFile}>✕</button>
                                </li>
                            )}

                            {!existingFile && !newFile && (
                                <li>첨부된 파일이 없습니다.</li>
                            )}
                        </ul>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className={style.buttonGroup}>
                        <button type="submit" className={style.primaryButton} disabled={updatePostMutation.isPending}>
                            {updatePostMutation.isPending ? "수정 중..." : "수정 완료"}
                        </button>
                        <button type="button" className={style.backButton} onClick={handleCancel}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostUpdate;
