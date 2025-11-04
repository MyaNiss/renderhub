import style from '../assets/css/cart.module.css';
import {useNavigate} from "react-router";
import {useCart} from "../customHook/useCart.jsx";

const Cart = ({isOpen, onClose, cartItems = []}) => {
    const navigate = useNavigate();

    const { deleteCartItem, clearCart } = useCart();

    if(!isOpen) return null;

    const moveToBuy = () => {
        const purchaseItems = cartItems.map((item) => ({
            postId: item.postId,
            purchaseType: 'cart'
        }));

        onClose();
        navigate('/transaction/buy', {
            state : {
                items: purchaseItems
            }
        });
    }

    const isCartEmpty = cartItems.length === 0;

    const handleDelete = (postId) => {
        if(window.confirm("장바구니에서 해당 항목을 삭제하시겠습니까?")){
            deleteCartItem.mutate(postId);
        }
    };

    const handleClear = () => {
        if(window.confirm("장바구니를 비우시겠습니까?")) {
            clearCart.mutate();
        }
    }


    return (
        <div className={style.cartOverlay} onClick={onClose}>
            <div className={style.cartContent} onClick={(e) => e.stopPropagation()}>
                <div className={style.cartHeader}>
                    <h3>장바구니</h3>
                    <button onClick={onClose} className={style.closeButton}>
                        &times;
                    </button>
                </div>
                {isCartEmpty ? (
                    <div className={style.emptyCart}>
                        <p>장바구니에 담긴 상품이 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div className={style.cartActions}>
                            <button
                                onClick={handleClear}
                                className={style.clearCartButton}
                            >
                                장바구니 전체 비우기
                            </button>
                        </div>

                        <ul className={style.cartList}>
                            {/* 장바구니 항목 렌더링 */}
                            {cartItems.map(item => (
                                <li key={item.postId} className={style.cartItem}>
                                    <div className={style.itemInfo}>
                                        <p className={style.itemTitle}>
                                            **{item.title || `상품 ID: ${item.postId}`}** </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.postId)}
                                        className={style.removeItemButton}
                                    >
                                        삭제
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={moveToBuy}
                            className={style.checkoutButton}
                        >
                            구매 화면으로 이동 (개 상품)
                        </button>
                    </>
                )}

            </div>
        </div>
    )
}

export default Cart;