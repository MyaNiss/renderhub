import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {boardAPI} from "../../service/boardService.jsx";
import Pagination from "../../components/Pagination.jsx";
import style from "../../assets/css/board.common.module.css";
import {BOARD_CATEGORIES} from "../../utils/constants/boardCategories.jsx";

const BoardList = () => {

    const [page, setPage] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(['all']);

    const resetPagesAndSetCategories = (newCategories) => {
        setPage(0);
        setSelectedCategories(newCategories);
    }

    const categoriesToSend = selectedCategories.includes('all') ? [] : selectedCategories;

    const {isLoading, data, error} = useQuery({
        queryKey:['boardList', page, selectedCategories],
        queryFn: () => boardAPI.getBoardList(page, categoriesToSend)
    })

    const boardList = data?.data || [];
    const totalRows = data?.total || 0;

    const navigate = useNavigate();

    const moveToPage = (page) => {
        setPage(page);
    }

    const handleAllClick = () => {
        resetPagesAndSetCategories(['all']);
    }

    //카테고리 선택 핸들러
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

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h2>게시글 리스트</h2>
            </header>
            <section className={style.section}>
                <div className={style.flexContainer}>
                    <div className={style.categoryGroup}>
                        <button
                            className={`${style.button} ${selectedCategories.includes('all') ? style.buttonAllSelected : style.buttonAll}`}
                            onClick={handleAllClick}
                        >
                            전체
                        </button>

                        {BOARD_CATEGORIES.map(category => (
                            <button
                                key={category.value}
                                className={`${style.button} ${
                                    !selectedCategories.includes('all') && selectedCategories.includes(category.value)
                                        ? style.buttonPrimary
                                        : style.buttonOutline
                                }`}
                                onClick={() => handleCategoryClick(category.value)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <button
                        className={`${style.button} ${style.buttonPrimary}`}
                        onClick={() => navigate('/board/write')}
                    >
                        글 등록
                    </button>
                </div>

                <table className={style.table}>
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '40%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '25%' }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>글번호</th>
                        <th>글 제목</th>
                        <th>작성자</th>
                        <th>조회 수</th>
                        <th>수정 일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.length > 0 ? (
                        boardList.map((board) => (
                            <tr key={board.id}>
                                <td>{board.id}</td>
                                <td>
                                    <a href="#!" onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/board/${board.id}`);
                                    }}>
                                        {board.title}
                                    </a>
                                </td>
                                <td>{board.writer}</td>
                                <td>{board.viewCount}</td>
                                <td>{board.updatedAt
                                    ? new Date(board.updatedAt).toLocaleTimeString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })
                                    : 'N/A'
                                }</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className={style.textCenter}>게시글이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
            <div className={style.paginationWrapper}>
                <Pagination page={page} totalRows={totalRows} movePage={moveToPage} />
            </div>
        </div>
    );
};

export default BoardList;