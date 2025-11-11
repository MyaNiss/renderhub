import React, {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import {useOrder} from "../../customHook/useOrder.jsx";
import style from "../../assets/css/transaction.common.module.css";
import {loadTossPayments} from "@tosspayments/payment-sdk";
import {usePost, usePostDetail} from "../../customHook/usePost.jsx";
import {useProductQueries} from "../../customHook/useProductQueries.jsx";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

const TransactionBuy = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const purchaseItems = location.state?.items || [];
    const postIds = purchaseItems.map(item => item.postId);

    const [tossOrderData, setTossOrderData] = useState(null);
    const [paymentWidget, setPaymentWidget] = useState(null);
    const [isWidgetLoading, setIsWidgetLoading] = useState(true);

    const postDetailQueries = useProductQueries(postIds);
    const {createOrderMutation} = useOrder();

    const handleGoBack = () => {
        navigate(-1);
    };

    const finalItems = useMemo(() => {
        return purchaseItems.map(item => {
            const query = postDetailQueries.find(query => query.data?.postId === item.postId);
            const postDetail = query?.data;

            return {
                ...item,
                title: postDetail?.title,
                price: postDetail?.price
            };
        });
    }, [purchaseItems, postDetailQueries]);

    const totalPrice = useMemo(() => {
        return finalItems.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }, [finalItems]);

    useEffect(() => {
        if (purchaseItems.length === 0) {
            alert("구매할 상품 정보가 없습니다");
            navigate('/');
            return;
        }

        const setupPaymentWidget = async () => {
            const postIdToPurchase = purchaseItems.length === 1 ? purchaseItems[0].postId : null;
            const dataForBackend = {
                postId: postIdToPurchase,
            };

            try {
                const tossPreparationData = await createOrderMutation.mutateAsync(dataForBackend);
                setTossOrderData(tossPreparationData);

                const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

                const widget = tossPayments.widgets.create(
                    TOSS_CLIENT_KEY,
                    tossPreparationData.tossOrderCode
                );

                widget.renderPaymentMethods(
                    '#payment-widget',
                    tossPreparationData.totalPrice
                );

                widget.renderAgreement('#agreement-widget');

                setPaymentWidget(widget);

            } catch (error) {
                console.error("결제 위젯 로딩 오류:", error);
                alert("결제 위젯을 로드할 수 없습니다.");
            } finally {
                setIsWidgetLoading(false);
            }
        };

        setupPaymentWidget();

    }, [purchaseItems, createOrderMutation, navigate, postDetailQueries]);


    const purchase = async () => {
        if (!paymentWidget || !tossOrderData || isWidgetLoading) {
            alert("결제 시스템 준비 중입니다. 잠시만 기다려주세요.");
            return;
        }

        try {
            await paymentWidget.requestPayment({
                successUrl: window.location.origin + '/transaction/success',
                failUrl: window.location.origin + '/transaction/fail',
                customerName: "고객명",
            });

        } catch (error) {
            console.error("결제 요청 오류:", error);
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

            <h2>주문 / 결제 최종 확인</h2>

            <section className={style.section}>
                <h3 className={style.sectionHeader}>📦 주문 상품 ({finalItems.length}종)</h3>
                <ul>
                    {finalItems.map((item, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                            **{item.title}** (1개) / 금액: {item.price ? item.price.toLocaleString() : '가격 미정'}원
                        </li>
                    ))}
                </ul>
            </section>

            <section className={style.section}>
                <h3 className={style.sectionHeader}>💳 결제 수단 선택</h3>
                <div id="payment-widget" style={{ minHeight: '200px', border: '1px solid #eee', padding: '15px' }}>
                    {(isWidgetLoading || !tossOrderData) && <p>결제 위젯을 불러오는 중...</p>}
                </div>
            </section>

            <div className={style.totalSummary}>
                <p style={{fontSize: '1.2em', fontWeight: 'bold'}}>
                    총 결제 금액: {totalPrice.toLocaleString()} 원
                </p>

                <button
                    onClick={purchase}
                    className={style.checkoutButton}
                    style={{marginTop: '10px'}}
                    disabled={isWidgetLoading || !tossOrderData}
                >
                    결제하기
                </button>
            </div>
        </div>
    );
};

export default TransactionBuy;