import React, {useCallback} from 'react';
import {useState} from "react";
import style from '../assets/css/header.module.css'
import ProfileDropdown from "./ProfileDropdown.jsx";
import {useAuthStore} from "../store/authStore.jsx";
import useSearch from "../customHook/useSearch.jsx";
import {useLocation} from "react-router";
import Cart from "./Cart.jsx";
import {useCart} from "../customHook/useCart.jsx";
// import {accountAPI} from "../service/accountService.jsx";

const Header = () => {

    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const {logout : storeLogout} = useAuthStore();

    // const logout = async () => {
    //     try {
    //         const result = await accountAPI.logout();
    //
    //
    //         if(result.resultCode === 200){
    //             console.log("로그아웃 성공");
    //             storeLogout();
    //         }else{
    //             alert('로그아웃 실패');
    //         }
    //     }catch (error) {
    //         console.error(error);
    //     }
    // }
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
    const userName = useAuthStore((state) => state.userName);

    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => {
        setIsCartOpen(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsCartOpen(false);
    })

    const {getCartItems} = useCart(isCartOpen);

    const cartItems = getCartItems.data ?? [];

    const {searchTerm, setSearchTerm, handleSearch} = useSearch();

    const executeSearch = () => {
        handleSearch(searchTerm);
    }

    return (
        <>
            <div className={style.header}>
                <div className={style.leftSection}>
                    <div className={style.logo}>
                        <a href="/">로고</a>
                    </div>

                    <nav className={style.nav}>
                        <a href="/post" className={style.menuItem}>탐색</a>
                        <a href="/board" className={style.menuItem}>게시판</a>
                    </nav>
                </div>
                {!isHomePage && (
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            className={style.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {if (e.key === 'Enter') {executeSearch()}}}
                        />
                        <button className={style.searchButton} onClick={executeSearch}>
                            Q
                        </button>
                    </div>
                )}

                <div className={style.authContainer}>
                    {isAuthenticated ? (
                        <ProfileDropdown
                            username={userName}
                            // onLogout={logout}
                            openCart={openCart}
                        />
                    ) : (
                        <>
                            <a href="/login" className={style.authButton}>로그인</a>
                            <a href="/register" className={`${style.authButton} ${style.registerButton}`}>회원가입</a>
                        </>
                    )}
                </div>
            </div>
            <Cart isOpen={isCartOpen} onClose={closeCart} cartItems={cartItems}/>
        </>
    );
};

export default Header;