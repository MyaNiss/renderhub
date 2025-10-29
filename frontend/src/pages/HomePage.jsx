import React, {useCallback} from 'react';
import useSearch from "../customHook/useSearch.jsx";
import style from "../assets/css/homepage.module.css";
import {Link} from "react-router";

const HomePage = () => {
    const {searchTerm, setSearchTerm, handleSearch} = useSearch();

    const executeSearch = () => {
        handleSearch(searchTerm);
    }

    return (
        <div className={style['main-page']}>
            <div className={style['main-content']}>
                <div className={style['main-logo-area']}>
                    <Link to="/">
                        <img
                            src=""
                            alt="회사 메인 로고"
                            className={style['large-logo']}
                        />
                    </Link>
                </div>

                <div className={style['main-search-bar']}>
                    <input
                        type="text"
                        placeholder="찾으시는 상품을 검색하세요"
                        className={style['main-search-input']}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {if (e.key === 'Enter') {executeSearch()}}}
                    />
                    <button
                        className={style['main-search-button']}
                        onClick={executeSearch}
                    >
                        검색
                    </button>
                </div>

                <div className={style['recommended-items-section']}>
                    <h2>오늘의 추천 아이템</h2>
                    <div className={style['item-list']}>
                        <div className={style['item-card']}>상품 1</div>
                        <div className={style['item-card']}>상품 2</div>
                        <div className={style['item-card']}>상품 3</div>
                        <div className={style['item-card']}>상품 4</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;