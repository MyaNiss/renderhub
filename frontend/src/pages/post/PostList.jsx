import React, {useEffect, useState} from 'react';
import style from "../../assets/css/post.common.module.css";
import {useQuery} from "@tanstack/react-query";
import {useNavigate, useSearchParams} from "react-router";
import {postAPI} from "../../service/postService.jsx";
import Pagination from "../../components/Pagination.jsx";
import {useCategories} from "../../customHook/useCategories.jsx";
import {CATEGORY_TYPES} from "../../utils/constants/categoryTypes.js";


const PostList = () => {

    const [page, setPage] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(['all']);
    const [selectedFileType, setSelectedFileType] = useState('');

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q');

    useEffect(() => {
        setPage(0);
    }, [keyword]);

    const { categories: postCategories } = useCategories(CATEGORY_TYPES.POST);
    const availableCategories = postCategories || [];

    const { categories: postFileTypes } = useCategories(CATEGORY_TYPES.POST_FILE);
    const availableFileTypes = [{id: 'all', name: '전체'}, ...(postFileTypes || [])];

    const resetPagesAndSetCategories = (newCategories) => {
        setPage(0);
        setSelectedCategories(newCategories);
    }

    const resetPagesAndSetFileType = (newType) => {
        setPage(0);
        setSelectedFileType(newType);
    };

    const categoriesToSend = selectedCategories.includes('all') ? [] : selectedCategories;
    const fileTypeToSend = selectedFileType === 'all' ? '' : selectedFileType;

    const {isLoading, data, error} = useQuery({
        queryKey:['postList', page, selectedCategories, selectedFileType, keyword],
        queryFn: () => postAPI.getPostList(page, categoriesToSend, fileTypeToSend, keyword)
    })

    const postList = data?.content || [];
    const totalRows = data?.totalElements;

    const navigate = useNavigate();

    const moveToPage = (page) => {
        setPage(page);
    }

    //포스트 카테고리 선택 핸들러
    const handleCategoryClick = (categoryId) => {
        if(categoryId === 'all') {
            resetPagesAndSetCategories(['all']);
            return;
        }

        let newCategories = selectedCategories.filter(category => category !== 'all');
        const isSelected = newCategories.includes(categoryId);

        if(isSelected) {
            const filteredCategories = newCategories.filter(category => category !== categoryId);

            if(filteredCategories.length === 0){
                resetPagesAndSetCategories(['all']);
            }else {
                resetPagesAndSetCategories(filteredCategories);
            }
        } else {
            newCategories.push(categoryId);
            resetPagesAndSetCategories(newCategories);
        }
    }

    //파일 타입 선택 핸들러
    const handleFileTypeClick = (fileTypeId) => {
        if(selectedFileType === fileTypeId) {
            resetPagesAndSetFileType('all');
        }else {
            resetPagesAndSetFileType(fileTypeId);
        }
    };

    const handleItemClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <div className={style.filter}>
                    <button
                        className={`${style.postButton} ${selectedCategories.includes('all') ? style.postButtonPrimary : style.postButtonOutline}`}
                        onClick={() => resetPagesAndSetCategories(['all'])}
                    >
                        전체
                    </button>
                    <div className={style.postCategory}>
                        {availableCategories.map(category => (
                            <button
                                key={category.id}
                                className={`${style.postButton} ${
                                    !selectedCategories.includes('all') && selectedCategories.includes(category.id)
                                        ? style.postButtonPrimary
                                        : style.postButtonOutline
                                }`}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    <section className={style.fileType}>
                        {availableFileTypes.map(type => (
                            <button
                                key={type.id}
                                className={`${style.typeButton} ${
                                    selectedFileType === type.id
                                        ? style.typeButtonPrimary
                                        : style.typeButtonOutline
                                }`}
                                onClick={() => handleFileTypeClick(type.id)}
                            >
                                {type.name}
                            </button>
                        ))}
                    </section>
                </div>
                <div>
                    <section className={style.list}>
                        {postList.length === 0 ? (
                            <div className={style.noData}>등록된 포스트가 없습니다.</div>
                        ) : (
                            postList.map((post) => (
                                <div
                                    key={post.postId}
                                    className={style.item}
                                    onClick={() => handleItemClick(post.postId)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <section className={style.itemImage}>
                                        3D 이미지
                                    </section>
                                        <section className={style.userProfile}>{post.writer.nickname}</section>
                                    <section className={style.itemInfo}>
                                        <section className={style.title}>{post.title}</section>
                                    </section>
                                    <section className={style.price}>
                                        ₩{post.price === 0 ? '무료' : post.price?.toLocaleString()}
                                    </section>
                                </div>
                            ))
                        )}
                    </section>
                </div>
            </div>
            {postList.length > 0 && (
                <div className={style.paginationWrapper}>
                    <Pagination page={page} totalRows={totalRows} movePage={moveToPage}/>
                </div>
            )}
        </div>
    );
};

export default PostList;