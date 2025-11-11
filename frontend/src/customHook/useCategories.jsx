import {useQuery} from "@tanstack/react-query";
import {boardAPI} from "../service/boardService.jsx";


export const useCategories = (type) => {

    const { data : allCategories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: boardAPI.getCategories,
        staleTime: Infinity,
    });

    const categories = allCategories.filter(category => category.categoryType === type);

    const getCategoryName = (id) => {
        const category = categories.find(c => c.id === id);
        return category ? category.name : '미분류';
    }

    const formattedCategories = categories.map((category) => ({
        id: category.categoryId || category.id,
        name: category.name,
        type: category.type,
    }))

    return { categories: formattedCategories, isLoading, getCategoryName };
}