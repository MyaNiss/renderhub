import React from "react";
import style from "../../assets/css/post.common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router";

const PostDetail = () => {
    const navigate = useNavigate();
    const { id: postId } = useParams();

    const product = {
        title: "제품명",
        authorImage: "/images/profile-sample.jpg",
        category: "카테고리",
        content: "제품에 대한 상세 설명입니다.",
        images: ["/images/sample1.jpg", "/images/sample2.jpg"],
        files: [{ name: "sample.obj", url: "#" }],
    };

    const handleEdit = () => navigate(`/post/update/${postId}`);
    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            alert("삭제되었습니다.");
            navigate("/post");
        }
    };
    const handleBack = () => navigate("/post");

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <header className={style.postHeader}>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={product.authorImage}
                            alt="작성자"
                            className={style.authorProfile}
                        />
                        <h2 className={style.postTitle}>{product.title}</h2>
                    </div>
                    <button className={style.backButton} onClick={handleBack}>
                        목록으로
                    </button>
                </header>

                {/* 이미지 슬라이드 */}
                <div
                    id="productCarousel"
                    className="carousel slide mt-4"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-inner rounded-3 overflow-hidden">
                        {product.images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`carousel-item ${idx === 0 ? "active" : ""}`}
                            >
                                <img src={img} className="d-block w-100" alt={`slide-${idx}`} />
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#productCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#productCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>

                <div className={`${style.categoryBadge} mt-3`}>
                    {product.category}
                </div>

                <section className={`${style.postContent} mt-4`}>
                    <h5>제품 설명</h5>
                    <p>{product.content}</p>
                </section>

                <section className={`${style.postFiles} mt-4`}>
                    <h5>첨부 파일</h5>
                    <ul>
                        {product.files.map((file, idx) => (
                            <li key={idx}>
                                <a href={file.url} download>
                                    📎 {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className={`${style.buttonGroup} mt-4`}>
                    <button className={style.primaryButton} onClick={handleEdit}>
                        수정
                    </button>
                    <button className={style.dangerButton} onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
