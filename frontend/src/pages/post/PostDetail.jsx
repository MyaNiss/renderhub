import React, {useEffect, useState} from "react";
import style from "../../assets/css/post.common.module.css";
import { useNavigate, useParams } from "react-router";
import {useCart} from "../../customHook/useCart.jsx";
import {usePost, usePostDetail} from "../../customHook/usePost.jsx";
import {useAuthStore} from "../../store/authStore.jsx";
import CommentForm from "../comment/CommentForm.jsx";
import CommentList from "../comment/CommentList.jsx";

const PostDetail = () => {
    const navigate = useNavigate();
    const { id: postId } = useParams();
    const {deletePostMutation} = usePost();

    const currentUserId = useAuthStore((state) => state.userId);
    const currentUserRole = useAuthStore((state) => state.userRole);

    const { addCart } = useCart();
    const [activeIndex, setActiveIndex] = useState(0);

    const {
        data: postDetail, isLoading, error
    } = usePostDetail(postId);

    if (isLoading) {
        return <div className={style.container}><div className={style.contents}>상세 정보를 불러오는 중입니다...</div></div>;
    }

    if (!postDetail) {
        return <div className={style.container}><div className={style.contents}>존재하지 않는 게시글입니다.</div></div>;
    }

    const BASE_URL = "http://localhost:9090";

    const mappedImageUrls = (postDetail.imageUrls || []).map((imageUrl) => {
        return imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    })

    const isAuthor = currentUserId && postDetail.writer.userId === currentUserId;
    const isAdmin = currentUserRole === 'USER_ADMIN';
    const isAuthorOrAdmin = isAuthor || isAdmin;

    const handlePrev = () => {
        setActiveIndex(prevIndex =>
            prevIndex === 0 ? mappedImageUrls.length - 1 : prevIndex - 1
        );
    }

    const handleNext = () => {
        setActiveIndex(prevIndex =>
            prevIndex === mappedImageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleEdit = () => navigate(`/post/update/${postId}`);
    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            const res = await deletePostMutation.mutateAsync(postId);

            alert("삭제되었습니다.");
            navigate("/post");
        }
    };

    const handleBack = () => navigate("/post");

    const handleAddToCart = () => {
        addCart.mutate(postId, {
            onSuccess: () => alert("장바구니에 상품이 추가되었습니다"),
            onError: error => console.error(error),
        })
    };

    const handleBuyNow = () => {
        const purchaseItem = [{
            postId: postId
        }];

        navigate('/transaction/buy',{
            state: { purchaseItem },
        })
    }

    const imageUrls = postDetail.imageUrls || [];
    const hasMultipleImages = imageUrls.length > 1;

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <header className={style.postHeader}>
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={postDetail.writer.profileImage || "/"}
                            alt={postDetail.writer.nickname}
                            className={style.authorProfile}
                        />
                        <h2 className={style.postTitle}>{postDetail.title}</h2>
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
                        {mappedImageUrls.length > 0 ? (
                            mappedImageUrls.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`carousel-item ${idx === activeIndex ? "active" : ""}`}
                                >
                                <img src={img} className="d-block w-100" alt={`slide-${idx}`} />
                            </div>
                            ))
                        ) : (
                            <div className="carousel-item active">
                                <img src="/images/no-image.jpg" className="d-block w-100" alt="No image available" />
                            </div>
                        )}
                    </div>
                    {hasMultipleImages && (
                        <>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                onClick={handlePrev}
                            >
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                onClick={handleNext}
                            >
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </>
                    )}
                </div>

                <div className={`${style.categoryBadge} mt-3`}>
                    {postDetail.categoryName}
                </div>

                <section className={`${style.postContent} mt-4`}>
                    <h5>제품 설명</h5>
                    <p>{postDetail.content}</p>
                </section>

                <section className={`${style.postFiles} mt-4`}>
                    <h5>첨부 파일</h5>
                    <ul>
                        {postDetail.productFileName ? (
                            <li>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert("이 파일은 구매 후 다운로드할 수 있습니다.");
                                    }}
                                >
                                    📎 **{postDetail.productFileName}**
                                </a>
                            </li>
                        ) : (
                            <li>첨부 파일 없음</li>
                        )}
                    </ul>
                </section>

                <div className={`${style.buttonGroup} mt-4`}>
                    <button
                        className={style.primaryButton}
                        onClick={handleBuyNow}
                    >
                        바로 구매
                    </button>

                    <button
                        className={style.primaryButton}
                        onClick={handleAddToCart}
                    >
                        장바구니 담기
                    </button>
                    {isAuthor && (
                        <>
                            <button className={style.primaryButton} onClick={handleEdit}>
                                수정
                            </button>
                            <button className={style.dangerButton} onClick={handleDelete}>
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div style={{marginTop: '40px'}}>
                <CommentForm resourceType={'post'} parentId={postId}/>
                <CommentList resourceType={'post'} parentId={postId}/>
            </div>
        </div>
    );
};

export default PostDetail;
