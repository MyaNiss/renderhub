import React from 'react';
import {useNavigate, useParams} from "react-router";
import {useOrder} from "../../customHook/useOrder.jsx";
import style from "../../assets/css/transaction.common.module.css";

const OrderDetail = () => {
    const navigate = useNavigate();
    const {orderId} = useParams();

    const {getOrder} = useOrder(orderId);

    const {
        data: orderDetail
    } = getOrder;

    const handleGoBack = () => {
        navigate(-1);
    };

    if(!orderDetail) {
        return <div className={style.pageContainer}>해당 주문 정보(ID: {orderId})를 찾을 수 없습니다.</div>;
    }

    return (
        <div className={style.pageContainer}>
            <button
                onClick={handleGoBack}
                className={style.backButton}
            >
                ⬅️ 뒤로가기
            </button>
            <h2>주문 상세 정보 (ID: {orderId})</h2>
            <div className={style.section}>

                <h3 className={style.sectionHeader}>기본 정보</h3>
                <p><strong>주문 번호:</strong> {orderDetail.orderId}</p>
                <p><strong>주문일:</strong> {new Date(orderDetail.orderDate).toLocaleString()}</p>
                <p><strong>주문 상태:</strong> <span className={style.statusText}>{orderDetail.status}</span></p>

                <hr className={style.divider}/>

                <h3 className={style.sectionHeader}>결제 정보</h3>
                <p><strong>최종 결제 금액:</strong> <span className={style.totalPriceText} style={{fontSize: '1em'}}>{orderDetail.totalPrice.toLocaleString()} 원</span></p>
                <p><strong>결제 수단:</strong> {orderDetail.paymentMethod}</p>

                <hr className={style.divider}/>

                <h3 className={style.sectionHeader}>📦 주문 상품 ({orderDetail.items.length}종)</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                    {orderDetail.items.map((item, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                            {item.title} ({item.postId}) / 가격: {item.price.toLocaleString()}원
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderDetail;