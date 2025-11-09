import {useNavigate} from "react-router";
import style from "../../assets/css/transaction.common.module.css";

const PaymentFailPage = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);

    const errorCode = searchParams.get("code");
    const errorMessage = searchParams.get('message');
    const tossOrderCode = searchParams.get('orderId');

    const handleRetry = () => {
        navigate('/cart');
    };

    const handleHome = () => {
        navigate('/');
    };
    return (
        <div className={style.pageContainer} style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#d9534f' }}>❌ 결제 실패</h2>
            <p style={{ fontWeight: 'bold' }}>
                고객님의 결제 요청이 처리되지 못했습니다.
            </p>

            <div
                className={style.errorDetail}
                style={{
                    marginTop: '20px',
                    padding: '20px',
                    border: '1px solid #fdd',
                    backgroundColor: '#fff8f8',
                    borderRadius: '8px',
                    textAlign: 'left',
                    display: 'inline-block',
                    minWidth: '300px'
                }}
            >
                <h4 style={{ color: '#d9534f' }}>실패 상세 정보</h4>
                <p><strong>주문 번호:</strong> {tossOrderCode || 'N/A'}</p>
                <p><strong>실패 코드:</strong> {errorCode || 'N/A'}</p>
                <p><strong>실패 메시지:</strong> {errorMessage || '결제 시스템 오류. 관리자에게 문의하세요.'}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={handleRetry}
                    className={style.checkoutButton}
                    style={{ marginRight: '10px', backgroundColor: '#5cb85c' }}
                >
                    결제 다시 시도하기
                </button>
                <button
                    onClick={handleHome}
                    className={style.backButton}
                    style={{ backgroundColor: '#f0ad4e' }}
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default PaymentFailPage;