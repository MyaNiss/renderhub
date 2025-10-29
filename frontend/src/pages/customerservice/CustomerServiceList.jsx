import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {useQuery} from "@tanstack/react-query";
import Pagination from "../../components/Pagination.jsx";
import style from "../../assets/css/cs.common.module.css";
import {useAuthStore} from "../../store/authStore.jsx";
import {csAPI} from "../../service/customerserviceService.jsx";
import {CS_CATEGORIES} from "../../utils/constants/csCategories.jsx";

const CustomerServiceList = () => {

    const [page, setPage] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(['all']);

    const currentUserId = useAuthStore(state => state.userId);
    const currentUserRole = useAuthStore(state => state.userRole);

    const isAdmin = currentUserRole === 'ADMIN';

    const resetPagesAndSetCategories = (newCategories) => {
        setPage(0);
        setSelectedCategories(newCategories);
    }

    const categoriesToSend = selectedCategories.includes('all') ? [] : selectedCategories;

    const navigate = useNavigate();

    const {isLoading, data, error} = useQuery({
        queryKey:['csList', page, selectedCategories, currentUserId, currentUserRole],
        queryFn: () => csAPI.getCsList({
            page: page,
            categories: categoriesToSend,
            userId: currentUserId,
            userRole: currentUserRole
        })
    })

    const csList = data?.data || [];
    const totalRows = data?.total || 0;

    const moveToPage = (page) => {
        setPage(page);
    }

    const handleAllClick = () => {
        resetPagesAndSetCategories(['all']);
    }

    const handleCategoryClick = (categoryValue) => {

        let newCategories = [...selectedCategories];

        const allIndex = newCategories.indexOf('all');
        if(allIndex > -1) {
            newCategories.splice(allIndex, 1);
        }

        const isSelected = selectedCategories.includes(categoryValue);

        if(isSelected) {
            const filteredCategories = newCategories.filter(category => category !== categoryValue);

            if(filteredCategories.length === 0){
                resetPagesAndSetCategories(['all']);
            }else {
                resetPagesAndSetCategories(filteredCategories);
            }
        } else {
            newCategories.push(categoryValue);
            resetPagesAndSetCategories(newCategories);
        }
    }

    const canAccessContent = (cs) => {
        if (!cs.isPrivate) return true;

        const isAuthor = cs.writerId === currentUserId;

        return isAdmin || isAuthor;
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>고객 지원 리스트</h2>
            </header>
            <section className={style.section}>
                <div className={style.flexContainer}>
                    <div className={style.categoryGroup}>
                        <button className={`${style.button} ${selectedCategories.includes('all') ? style.buttonAllSelected : style.buttonAll}`} onClick={handleAllClick}>전체</button>
                        {CS_CATEGORIES.map(category => (<button key={category.value} className={`${style.button} ${!selectedCategories.includes('all') && selectedCategories.includes(category.value) ? style.buttonPrimary : style.buttonOutline}`} onClick={() => handleCategoryClick(category.value)}>{category.label}</button>))}
                    </div>
                    <button className={`${style.button} ${style.buttonPrimary}`} onClick={() => navigate('/cs/write')}>문의 등록</button>
                </div>

                <table className={style.table}>
                    <colgroup><col style={{ width: '10%' }} /><col style={{ width: '40%' }} /><col style={{ width: '15%' }} /><col style={{ width: '10%' }} /><col style={{ width: '25%' }} /></colgroup>
                    <thead><tr><th>글번호</th><th>제목</th><th>작성자</th><th>조회 수</th><th>수정 일</th></tr></thead>

                    <tbody>
                    {csList.length > 0 ? (
                        csList.map((cs) => {
                            const hasAccess = canAccessContent(cs);

                            return (
                                <tr key={cs.id} className={cs.isPrivate ? style.privateRow : ''}>
                                    <td>{cs.id}</td>
                                    <td>
                                        {hasAccess ? (
                                            <a href={`/cs/${cs.id}`} onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/cs/${cs.id}`);
                                            }}>
                                                {cs.isPrivate && (
                                                    <span style={{color: 'var(--color-danger)', marginRight: '5px'}}>
                                                        🔒
                                                    </span>
                                                )}
                                                {cs.title}
                                            </a>
                                        ) : (
                                            <span style={{color: 'gray', cursor: 'default'}}>
                                                🔒 비밀글입니다.
                                            </span>
                                        )}
                                    </td>
                                    <td>{cs.writer}</td>
                                    <td>{cs.viewCount}</td>
                                    <td>{cs.updatedAt ? new Date(cs.updatedAt).toLocaleTimeString('ko-KR', {
                                        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
                                    }) : 'N/A'
                                    }</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="5" className={style.textCenter}>등록된 고객 지원 글이 없습니다.</td></tr>
                    )}
                    </tbody>
                </table>
            </section>
            <div className={style.paginationWrapper}>
                <Pagination page={page} totalRows={totalRows} movePage={moveToPage}/>
            </div>
        </div>
    );
};

export default CustomerServiceList;
