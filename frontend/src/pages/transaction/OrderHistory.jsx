import React from 'react';
import {useNavigate} from "react-router";
import {useOrder} from "../../customHook/useOrder.jsx";
import style from "../../assets/css/transaction.common.module.css";

const OrderHistory = () => {
    const navigate = useNavigate();

    const { getOrders } = useOrder();

    const {
        data: orders
    } = getOrders;

    const viewDetail = (orderId) => {
        navigate(`/transaction/${orderId}`);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!orders|| orders.length === 0) {
        return <div className={style.pageContainer}>아직 주문한 내역이 없습니다.</div>;
    }

    return (
        <div className={style.pageContainer}>
            <button
                onClick={handleGoBack}
                className={style.backButton}
            >
                ⬅️ 뒤로가기
            </button>
            <h2>나의 주문 내역 ({orders.length} 건)</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {orders.map((order) => (
                    <li
                        key={order.orderId}
                        className={style.orderItem}
                    >
                        <p><strong>주문 번호:</strong> {order.orderId}</p>
                        <p><strong>주문일:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p><strong>총 결제 금액:</strong> {order.totalPrice.toLocaleString()} 원</p>
                        <p><strong>상태:</strong> <span className={style.statusText}>{order.status}</span></p>

                        <button
                            onClick={() => viewDetail(order.orderId)}
                            className={style.detailButton}
                        >
                            상세 보기
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;