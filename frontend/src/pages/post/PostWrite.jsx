import React, { useState } from "react";
import style from "../../assets/css/post.common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { POST_CATEGORIES } from "../../utils/constants/postCategories.jsx";
import { FILE_TYPE } from "../../utils/constants/fileType.jsx";
import { useNavigate } from "react-router";

const PostWrite = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [fileType, setFileType] = useState("");
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages(previews);
  };

  const handleFileUpload = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleCancel = () => {
    navigate('/post');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !fileType) {
      alert("카테고리와 파일 형식을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", category);
    formData.append("fileTypeId", fileType);

    // 이미지 파일 업로드
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:9090/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("업로드 실패");
      }

      alert("게시물이 등록되었습니다.");
      navigate("/post");
    } catch (error) {
      console.error(error);
      alert("게시물 등록 중 오류가 발생했습니다.");
    }
  };


  return (
      <div className={style.container}>
        <div className={style.contents}>
          <header className={style.postHeader}>
            <h2 className={style.postTitle}>새 게시물 등록</h2>
          </header>

          <form className={style.postForm} onSubmit={handleSubmit}>
            {/* 제목 */}
            <div className={style.formGroup}>
              <label>제목</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제품명을 입력하세요"
                  className={style.inputField}
                  required
              />
            </div>

            {/* 카테고리 선택 */}
            <div className={style.formGroup}>
              <label>카테고리</label>
              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={style.selectField}
                  required
              >
                <option value="">카테고리를 선택하세요</option>
                {POST_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                ))}
              </select>
            </div>

            {/* 이미지 업로드 */}
            <div className={style.formGroup}>
              <label>이미지 업로드</label>
              <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={style.fileInput}
              />
              <div className={style.imagePreviewWrapper}>
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`preview-${idx}`}
                        className={style.imagePreview}
                    />
                ))}
              </div>
            </div>

            {/* 내용 */}
            <div className={style.formGroup}>
              <label>제품 설명</label>
              <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="제품에 대한 상세 설명을 작성하세요"
                  className={style.textareaField}
                  rows="6"
                  required
              ></textarea>
            </div>

            {/* 파일 형식 선택 */}
            <div className={style.formGroup}>
              <label>파일 형식</label>
              <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className={style.selectField}
                  required
              >
                <option value="">파일 형식을 선택하세요</option>
                {FILE_TYPE.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                ))}
              </select>
            </div>

            {/* 파일 업로드 */}
            <div className={style.formGroup}>
              <label>첨부 파일</label>
              <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className={style.fileInput}
              />
              <ul className={style.fileList}>
                {files.map((file, idx) => (
                    <li key={idx}>📎 {file.name}</li>
                ))}
              </ul>
            </div>

            {/* 버튼 그룹 */}
            <div className={style.buttonGroup}>
              <button type="submit" className={style.primaryButton}>
                등록
              </button>
              <button
                  type="button"
                  className={style.backButton}
                  onClick={handleCancel}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default PostWrite;
