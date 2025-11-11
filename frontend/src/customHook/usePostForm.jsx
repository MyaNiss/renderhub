import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";

const validationSchema = yup.object().shape({
    title: yup.string()
        .required("제목은 필수 입력 항목입니다.")
        .max(100, "제목은 최대 100자입니다."),
    price: yup.number()
        .required("가격은 필수 입력 항목입니다.")
        .min(0, "가격은 0원 이상이어야 합니다.")
        .typeError("가격은 숫자 형식이어야 합니다."),
    content: yup.string()
        .required("제품 설명은 필수 입력 항목입니다."),
    categoryId: yup.number().typeError("카테고리를 선택해주세요.")
        .required("카테고리를 선택해 주세요."),
    fileTypeId: yup.number().typeError("파일 형식을 선택해 주세요.")
        .required("파일 형식을 선택해 주세요."),
});

export const usePostForm = (initialData = {}) => {

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: "",
            price: 0,
            content: "",
            categoryId: "",
            fileTypeId: ""
        },
    });

    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [existingFile, setExistingFile] = useState(null);
    const [newFile, setNewFile] = useState(null);

    useEffect(() => {
        if(initialData && initialData.postId) {

            reset({
                title : initialData.title || "",
                price : initialData.price || 0,
                content : initialData.content || "",
                categoryId : initialData.categoryId || null,
                fileTypeId : initialData.fileTypeId || null,
            });

            const BASE_URL = "http://localhost:9090";

            const fullImageUrls = (initialData.imageUrls || []).map(url => {
                return url.startsWith('http') ? url : `${BASE_URL}${url}`;
            })

            setExistingImageUrls(fullImageUrls);

            if(initialData.productFileName) {
                setExistingFile({
                    name: initialData.productFileName,
                    url: initialData.productFileUrl
                });
            } else {
                setExistingFile(null);
            }
        }
    }, [initialData, reset]);


    const handleImageUpload = (e) => {
        const newFilesArray = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...newFilesArray]);
    }

    const handleDeleteExistingImage = (index) => {
        setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
    }

    const handleDeleteNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if(file) {
            setExistingFile(null);
            setNewFile(file);
        }
    }

    const handleDeleteExistingFile = () => {
        if(window.confirm("기존 첨부 파일을 삭제하시겠습니까?")){
            setExistingFile(null);
            setNewFile(null);
        }
    }

    const handleDeleteNewFile = () => {
        setNewFile(null);
    }

    const allImageItems = [
        ...existingImageUrls.map((url, idx) => ({ id: `exist-${idx}`, type: 'url', content: url })),
        ...newImages.map((file, idx) => ({ id: `new-${idx}`, type: 'file', content: file })),
    ];

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if(!over || active.id === over.id) return;

        const oldIndex = allImageItems.findIndex(item => item.id === active.id);
        const newIndex = allImageItems.findIndex(item => item.id === over.id);

        const newCombinedImages = arrayMove(allImageItems, oldIndex, newIndex);

        const newExistingUrls = newCombinedImages
            .filter(item => item.type === 'url')
            .map(item => item.content);

        const newNewImages = newCombinedImages
            .filter(item => item.type === 'file')
            .map(item => item.content);

        setExistingImageUrls(newExistingUrls);
        setNewImages(newNewImages);
    }

    return {
        control,
        register,
        handleSubmit,
        errors,

        allImageItems,
        handleDragEnd,

        existingImageUrls,
        newImages,
        existingFile,
        newFile,

        handleImageUpload,
        handleDeleteExistingImage,
        handleDeleteNewImage,
        handleFileUpload,
        handleDeleteExistingFile,
        handleDeleteNewFile,
    };

}