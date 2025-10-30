import React, {useCallback, useState} from 'react';
import style from '../assets/css/header.module.css';

const ProfileDropdown = ({username, onLogout}) => {
    const [isOpen, setIsOpen ] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    }, []);

    const dropdownItems = [
        { label : '마이페이지', href: '/user/mypage', isBold: false },
        { label : '장바구니', href: '/transaction/cart', isBold: false },
        { label : '거래 내역', href: '/transaction/list', isBold: false},
        { label : '판매 등록', href: '/post/write', isBold: false },
        { label : '개인정보 관리', href: '/user/profile', isBold: false },
    ];

    return (
        <div className={style.profileDropdownContainer}>
            <button
                onClick={toggleDropdown}
                className={style.profileButton}
            >
                {username} {/*< className={style.caretIcon} />*/}
            </button>

            {isOpen && (
                <div className={style.dropdownMenu}>
                    {dropdownItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`${style.dropdownItem} ${item.isBold ? style.boldItem : ''}`}
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className={style.dropdownDivider} />
                    <button
                        onClick={onLogout}
                        className={`${style.dropdownItem} ${style.logoutButton}`}
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;