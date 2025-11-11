import React, { useState } from "react";
import style from "../../assets/css/post.common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";
import {usePostForm} from "../../customHook/usePostForm.jsx";
import {usePost} from "../../customHook/usePost.jsx";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {Controller} from "react-hook-form";


const SortableImageItem = ({ item, index, isExisting, onDeleteExisting, onDeleteNew }) => {

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

const PostWrite = () => {
  const navigate = useNavigate();

  const { categories } = useCategories(CATEGORY_TYPES.POST);
  const { categories: fileTypes } = useCategories(CATEGORY_TYPES.POST_FILE);

  const {
    control, register, handleSubmit, errors,
    allImageItems, handleDragEnd,
    newImages, newFile,
    handleImageUpload, handleDeleteNewImage,
    handleFileUpload, handleDeleteNewFile,
  } = usePostForm();

  const { createPostMutation } = usePost();

  const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 5 },
      }),
      useSensor(KeyboardSensor));

  const onValidSubmit = async (data) => {
    const formData = new FormData();

    const postData = {
      title: data.title,
      price: data.price,
      content: data.content,
      categoryId: data.categoryId,
      fileTypeId: data.fileTypeId,
      existingImageUrls: [],
      keepExistingFile: false,
    }

    const postBlob = new Blob([JSON.stringify(postData)], {
      type: "application/json",
    })

    formData.append("post", postBlob);

    newImages.forEach((image) => {
      formData.append("imageFiles", image);
    });

    if(newFile){
      formData.append("productFile", newFile);
    }

    try{
      const newPost = await createPostMutation.mutateAsync(formData);

      navigate(`/post`);

    } catch (error) {
      console.error("게시물 작성 실패 ", error);
      alert("게시물 등록 중 오류가 발생했습니다.");
    }
  }

  const handleCancel = () => {
    if(window.confirm("작성을 취소하시겠습니까?")){
      navigate(`/post`);
    }
  }

  const itemIds = allImageItems.map(item => item.id);


  return (
      <div className={style.container}>
          <div className={style.contents}>
              <header className={style.postHeader}>
                  <h2 className={style.postTitle}>새 게시물 등록</h2>
              </header>

              <form className={style.postForm} onSubmit={handleSubmit(onValidSubmit)}>

                  <div className={style.formGroup}>
                        <label>제목</label>
                        <input
                            type="text"
                            {...register("title")}
                            placeholder="제품명을 입력하세요"
                            className={style.inputField}
                        />
                        {errors.title && <p className={style.errorText}>{errors.title.message}</p>}
                  </div>

                  <div className={style.formGroup}>
                      <label>가격</label>
                      <input
                          type="number"
                          {...register("price", { valueAsNumber: true })}
                          placeholder="가격을 입력하세요"
                          className={style.inputField}
                      />
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
                                      {allImageItems.map((item, idx) => {
                                          const isExisting = item.type === 'url';

                                          return (
                                              <SortableImageItem
                                                  key={item.id}
                                                  item={item.content}
                                                  index={idx}
                                                  isExisting={isExisting}
                                                  onDeleteNew={handleDeleteNewImage}
                                              />
                                          );
                                      })}
                                  </div>
                              </SortableContext>
                          </DndContext>
                      </div>

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

                      <div className={style.formGroup}>
                          <label>첨부 파일 (모델 파일)</label>
                          <input
                              type="file"
                              onChange={handleFileUpload}
                              className={style.fileInput}
                          />
                          <ul className={style.fileList}>
                              {newFile && (
                                  <li key="new-file">
                                    📎 **{newFile.name}**
                                    <button type="button" className={style.removeFileButton} onClick={handleDeleteNewFile}>✕</button>
                                  </li>
                              )}

                              {!newFile && (
                                  <li>첨부된 파일이 없습니다.</li>
                              )}
                          </ul>
                      </div>

                      <div className={style.buttonGroup}>
                          <button type="submit" className={style.primaryButton}>
                            글 작성
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

export default PostWrite;
