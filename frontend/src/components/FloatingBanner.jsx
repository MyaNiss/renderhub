import React, {useEffect, useRef} from 'react';
import useTheme from "../customHook/useTheme.jsx";
import style from '../assets/css/floatingbanner.module.css';

const FloatingBanner = () => {
    const bannerRef = useRef(null);

    const { isDarkMode, toggleDarkMode } = useTheme();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    };

    // 배너와 푸터가 겹치지 않게 하기
    useEffect(() => {
        const banner = bannerRef.current;
        const footer = document.querySelector(".site-footer-global");

        if(!banner || !footer) return;

        const handleScroll = () => {
            const footerRect = footer.getBoundingClientRect();

            if(footerRect.top < window.innerHeight){
                const overlap = window.innerHeight - footerRect.top;

                if(overlap > 30){
                    banner.style.bottom = `${overlap}px`;
                }else{
                    banner.style.bottom = '30px';
                }
            }else {
                banner.style.bottom = '30px';
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={bannerRef} className={style.floatingBanner}>
            <h3 className={style.bannerTitle}>배너</h3>

            <button
                className={`${style.bannerBtn} ${style.accentBtn}`}
                onClick={toggleDarkMode}
                title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
                {isDarkMode ? 'Light' : 'Dark'}
            </button>

            <button
                className={`${style.bannerBtn} ${style.scrollBtn}`}
                onClick={scrollToTop}
                title="맨 위로"
            >
                TOP
            </button>

            <button
                className={`${style.bannerBtn} ${style.scrollBtn}`}
                onClick={scrollToBottom}
                title="맨 아래로"
            >
                BOTTOM
            </button>
        </div>
    );
};

export default FloatingBanner;