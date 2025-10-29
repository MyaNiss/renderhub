import React from 'react';
import style from '../assets/css/footer.module.css'

const Footer = () => {
    return (
            <div className={`${style["site-footer"]} site-footer-global`}>
                <div className={style['footer-container']}>

                    {/* 1. 고객센터 및 문의 */}
                    <div className={`${style['footer-column']} ${style['customer-service']}`}>
                        <h4>고객센터</h4>
                        <p><strong>전화번호:</strong> 02-1234-5678</p>
                        <p><strong>운영시간:</strong> 평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)</p>
                        <p><strong>이메일:</strong> support@yourcompany.com</p>
                        <a href="/cs" className={style['btn-link']}>1:1 문의 바로가기</a>
                    </div>

                    {/* 2. 회사 정보 및 주소 */}
                    <div className={`${style['footer-column']} ${style['company-info']}`}>
                        <h4>(주)회사명</h4>
                        <p><strong>대표자:</strong> 홍길동</p>
                        <p><strong>사업자등록번호:</strong> 123-45-67890</p>
                        <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123 (회사빌딩)</p>
                        <p><strong>통신판매업신고:</strong> 제 2025-서울강남-0001호</p>
                    </div>

                    {/* 3. 정책 및 유틸리티 링크 */}
                    <div className={`${style['footer-column']} ${style['legal-links']}`}>
                        <h4>정책 및 링크</h4>
                        <ul>
                            <li><a href="/terms">이용약관</a></li>
                            <li><a href="/privacy-policy">개인정보처리방침</a></li>
                            <li><a href="/sitemap">사이트맵</a></li>
                            <li><a href="https://www.ftc.go.kr/..." target="_blank">사업자정보확인</a></li>
                        </ul>
                    </div>
                </div>

                {/* 4. 저작권 및 소셜 미디어 영역 */}
                <div className={style['footer-bottom']}>
                    <p>&copy; 2025 (주)회사명. All Rights Reserved.</p>
                    <div className={style['social-links']}>
                        {/* 아이콘 클래스는 전역으로 유지하는 것이 일반적입니다. */}
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram">instagram</i></a>
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f">facebook</i></a>
                        <a href="#" aria-label="YouTube"><i className="fab fa-youtube">youtube</i></a>
                    </div>
                </div>
            </div>
    );
};

export default Footer;