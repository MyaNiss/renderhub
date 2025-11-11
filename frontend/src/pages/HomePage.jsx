import useSearch from "../customHook/useSearch.jsx";
import style from "../assets/css/homepage.module.css";
import {Link} from "react-router";
import {useRecommendedItems} from "../customHook/useRecommendedItems.jsx";

const HomePage = () => {
    const {searchTerm, setSearchTerm, handleSearch} = useSearch();

    const { recommendedItems, isLoading, isError } = useRecommendedItems();

    const executeSearch = () => {
        handleSearch(searchTerm);
    }

    const renderRecommendedItems = () => {
        if (isLoading) {
            return <div className={style['item-list']}>로딩 중...</div>;
        }

        if (isError) {
            return <div className={style['item-list']}>추천 상품을 불러오는 데 실패했습니다.</div>;
        }

        if (recommendedItems.length === 0) {
            return <div className={style['item-list']}>추천 상품이 없습니다.</div>;
        }

        return (
            <div className={style['item-list']}>
                {recommendedItems.map(item => (
                    <Link to={`/post/${item.postId}`} key={item.postId} className={style['item-card-link']}>
                        <div className={style['item-card']}>
                            <img src={item.imageUrl} alt={item.title} className={style['item-image']} />
                            <p className={style['item-title']}>{item.title}</p>
                            <p className={style['item-price']}>{item.price.toLocaleString()} 원</p>
                            <span className={style['item-purchase-count']}>구매: {item.purchaseCount}</span>
                        </div>
                    </Link>
                ))}
            </div>
        );
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
                        {renderRecommendedItems()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;