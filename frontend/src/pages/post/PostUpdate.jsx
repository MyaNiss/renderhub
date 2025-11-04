import React, { useState, useEffect } from "react";
import style from "../../assets/css/post.common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { POST_CATEGORIES } from "../../utils/constants/postCategories.jsx";
import { FILE_TYPE } from "../../utils/constants/fileType.jsx";

const PostUpdate = () => {
    // 기존 게시물 데이터를 불러왔다고 가정 (API 연동 시 useQuery로 대체)
    const existingPost = {
        title: "기존 제품명 [확장자명]",
        category: "가전 / 인테리어",
        fileType: "fbx",
        content: "이 제품은 고급스러운 디자인과 편리함을 모두 갖춘 모델입니다.",
        images: ["/images/sample1.jpg", "/images/sample2.jpg"],
        files: [
            { name: "제품 모델.fbx", url: "#" },
            { name: "제품 설명서.pdf", url: "#" },
        ],
    };

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [fileType, setFileType] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // 기존 데이터 초기 세팅
        setTitle(existingPost.title);
        setCategory(existingPost.category);
        setFileType(existingPost.fileType);
        setContent(existingPost.content);
        setImages(existingPost.images);
        setFiles(existingPost.files);
    }, []);

    const handleImageUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        const previews = newFiles.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...previews]);
    };

    const handleFileUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !fileType) {
            alert("카테고리와 파일 형식을 선택해주세요.");
            return;
        }
        alert("수정이 완료되었습니다.");
    };

    const handleCancel = () => {
        if (window.confirm("수정을 취소하시겠습니까?")) {
            alert("목록 페이지로 이동합니다.");
        }
    };

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <header className={style.postHeader}>
                    <h2 className={style.postTitle}>게시물 수정</h2>
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

                    {/* 이미지 업로드 + 미리보기 */}
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
                                <div key={idx} className={style.imageItem}>
                                    <img
                                        src={img}
                                        alt={`preview-${idx}`}
                                        className={style.imagePreview}
                                    />
                                    <button
                                        type="button"
                                        className={style.removeImageButton}
                                        onClick={() => handleDeleteImage(idx)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 제품 설명 */}
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
                            수정 완료
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

export default PostUpdate;
