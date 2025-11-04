import React, {useState} from 'react';
import style from "../../assets/css/post.common.module.css";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {postAPI} from "../../service/postService.jsx";
import {POST_CATEGORIES} from "../../utils/constants/postCategories.jsx";
import {FILE_TYPE} from "../../utils/constants/fileType.jsx";
import Pagination from "../../components/Pagination.jsx";


const PostList = () => {

    const [page, setPage] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(['all']);
    const [selectedFileType, setSelectedFileType] = useState('');

    const resetPagesAndSetCategories = (newCategories) => {
        setPage(0);
        setSelectedCategories(newCategories);
    }

    const resetPagesAndSetFileType = (newType) => {
        setPage(0);
        setSelectedFileType(newType);
    };

    const categoriesToSend = selectedCategories.includes('all') ? [] : selectedCategories;
    const fileTypeToSend = selectedFileType ? selectedFileType : '';

    const {isLoading, data, error} = useQuery({
        queryKey:['postList', page, selectedCategories, selectedFileType],
        queryFn: () => postAPI.getPostList(page, categoriesToSend, fileTypeToSend)
    })

    const postList = data?.data || [];

    //샘플데이터
    const samplePosts = [
        { id: 1, title: "3D 모델 1", price: 3000},
        { id: 2, title: "3D 모델 2" },
        { id: 3, title: "3D 모델 3", price: 5000 },
        { id: 4, title: "3D 모델 4" },
        { id: 5, title: "3D 모델 5" },
        { id: 6, title: "3D 모델 6", price: 1000 },
        { id: 7, title: "3D 모델 7" },
        { id: 8, title: "3D 모델 8", price: 500 },
        { id: 9, title: "3D 모델 9" },
        { id: 10, title: "3D 모델 10" },
        { id: 11, title: "3D 모델 11", price: 2000 },
        { id: 12, title: "3D 모델 12", price: 1000 },
        { id: 13, title: "3D 모델 13", price: 4000 },
    ];
    const displayList = postList.length > 0 ? postList : samplePosts;
    const totalRows = postList.length > 0 ? data?.total || 0 : samplePosts.length;

    //백엔드 연결 시에
//    const displayList = data?.data || [];
//    const totalRows = data?.total || 0;

    const navigate = useNavigate();

    const moveToPage = (page) => {
        setPage(page);
    }

    const handleAllClick = () => {
        resetPagesAndSetCategories(['all']);
    }

    //포스트 카테고리 선택 핸들러
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

    //파일 타입 선택 핸들러
    const handleFileTypeClick = (fileTypeValue) => {
        if (selectedFileType === fileTypeValue) {
            resetPagesAndSetFileType('');
        } else {
            resetPagesAndSetFileType(fileTypeValue);
        }
    };

    const handleItemClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className={style.container}>
            <div className={style.contents}>
                <div className={style.filter}>
                    <div className={style.postCategory}>
                        {POST_CATEGORIES.map(category => (
                            <button
                                key={category.value}
                                className={`${style.postButton} ${
                                    !selectedCategories.includes('all') && selectedCategories.includes(category.value)
                                        ? style.postButtonPrimary
                                        : style.postButtonOutline
                                }`}
                                onClick={() => handleCategoryClick(category.value)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                    <section className={style.fileType}>
                        {FILE_TYPE.map(type => (
                            <button
                                key={type.value}
                                className={`${style.typeButton} ${
                                    selectedFileType === type.value
                                        ? style.typeButtonPrimary
                                        : style.typeButtonOutline
                                }`}
                                onClick={() => handleFileTypeClick(type.value)}
                            >
                                {type.label}
                            </button>
                        ))}
                    </section>
                </div>
                <div>
                    <section className={style.list}>
                        {displayList.map((post) => (
                            <div
                                key={post.id}
                                className={style.item}
                                onClick={() => handleItemClick(post.id)}
                                style={{cursor: 'pointer'}}
                            >
                                <section className={style.itemImage}>
                                    3D 이미지
                                </section>
                                <section className={style.itemInfo}>
                                    <section className={style.userProfile}></section>
                                    <section className={style.title}>{post.title}</section>
                                </section>
                                <section className={style.price}>
                                    ₩{post.price?.toLocaleString() || '무료'}
                                </section>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <div className={style.paginationWrapper}>
                <Pagination page={page} totalRows={totalRows} movePage={moveToPage}/>
            </div>
        </div>
    );
};

export default PostList;