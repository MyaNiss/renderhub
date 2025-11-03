import React, {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import {useOrder} from "../../customHook/useOrder.jsx";
import style from "../../assets/css/transaction.common.module.css";

const TransactionBuy = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const purchaseItems = location.state?.items || [];
    const postIds = purchaseItems.map(item => item.postId);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const {getPostDetail} = (postIds);

    const {createOrderMutation} = useOrder();

    const handleGoBack = () => {
        navigate(-1);
    };

    const finalItems = useMemo(() => {
        return purchaseItems.map(item => {
            const query = getPostDetail.find(query => query.data?.postId === item.postId);
            const postDetail = query?.data;

            return {
                ...item,
                title: postDetail?.title,
                price: postDetail?.price
            };
        });
    }, [purchaseItems, getPostDetail]);

    const totalPrice = useMemo(() => {
        const subTotal = finalItems.reduce((total, item) => {
            return total + item.price;
        }, 0);

        return subTotal;
    }, [finalItems]);

    useEffect(() => {
        if (purchaseItems.length === 0) {
            alert("구매할 상품 정보가 없습니다");
            navigate('/');
        }
    }, [purchaseItems, navigate]);

    const purchase = async () => {

        const orderData = {
            items: purchaseItems.map((item) => ({
                postId: item.postId
            })),
            purchaseType: purchaseItems[0]?.purchaseType,
            totalPrice: totalPrice
        };

        try{
            const tossPreparationData = await createOrderMutation.mutateAsync(orderData);
            console.log("주문 데이터 전송 준비", orderData);

            alert("주문 정보 백엔드에 전달");
            navigate('/');
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={style.pageContainer}>
            <button
                onClick={handleGoBack}
                className={style.backButton}
            >
                ⬅️ 뒤로가기
            </button>

            <h2>주문 / 결제</h2>

            <section className={style.section}>
                <h3 className={style.sectionHeader}>📦 주문 상품 ({finalItems.length}종)</h3>
                <ul>
                    {finalItems.map((item, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                            **{item.title}** /  금액: {item.price.toLocaleString()}원
                        </li>
                    ))}
                </ul>
            </section>

            <section className={style.section}>
                <h3 className={style.sectionHeader}>💳 결제 수단</h3>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={style.addressInput}
                >
                    <option value="card">신용/체크카드</option>
                    <option value="bank">계좌이체</option>
                    <option value="point">포인트 결제</option>
                </select>
            </section>

            <div className={style.totalSummary}>
                <p style={{fontSize: '1.2em', fontWeight: 'bold'}}>총 상품 금액: {totalPrice.toLocaleString()} 원</p>

                <button
                    onClick={purchase}
                    className={style.checkoutButton}
                    style={{marginTop: '10px'}}
                >
                    결제
                </button>
            </div>
        </div>
    );
};

export default TransactionBuy;