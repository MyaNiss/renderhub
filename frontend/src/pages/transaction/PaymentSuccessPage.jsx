import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {orderAPI} from "../../service/orderService.jsx";


const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(window.location.search);

    const tossOrderCode = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');

    const [status, setStatus] = useState('결제를 확인하는 중입니다...');
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const FAIL_PATH = '/transaction/fail';

        if(!tossOrderCode || !paymentKey) {
            setStatus("결제 정보를 확인할 수 없습니다");
            alert("결제 정보를 확인할 수 없습니다");
            navigate(FAIL_PATH);
            return;
        }

        setStatus("최종 결제 승인 요청 중...");

        const confirmFinalPayment = async () => {
            try {
                const confirmOrder = await orderAPI.confirmPayment({
                    orderId: tossOrderCode,
                    paymentKey: paymentKey,
                });

                const dbOrderId = confirmOrder.orderId;

                setStatus(`결제 완료. 주문번호: ${confirmOrder.tossOrderCode}`);
                alert(`결제 완료. 주문번호 : ${confirmOrder.tossOrderCode}`);

                navigate(`/transaction/${dbOrderId}`);

            }catch (error) {
                console.error("최종 결제 승인 실패 : ", error);

                let errorMessage = "결제 승인 중 알 수 없는 오류가 발생했습니다.";

                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                setStatus(`주문 처리 오류: ${errorMessage}`);
                alert(`주문 처리 오류: ${errorMessage}`);
                navigate(FAIL_PATH);

            } finally {
                setIsProcessing(false);
            }
        };
        confirmFinalPayment();
    }, [tossOrderCode, paymentKey, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            {isProcessing ? (
                <>
                    <h2>⏳ {status}</h2>
                    <p>안전하게 주문을 처리하는 중입니다. 잠시만 기다려주세요.</p>
                </>
            ) : (
                <>
                    <h2>✅ 처리 완료</h2>
                    <p>자동으로 주문 상세 페이지로 이동합니다.</p>
                </>
            )}
        </div>
    )
}

export default PaymentSuccessPage;