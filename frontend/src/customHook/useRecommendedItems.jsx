import {useContext} from "react";
import {useQuery} from "@tanstack/react-query";
import {postAPI} from "../service/PostService.jsx";


export const useRecommendedItems = () => {
    const { data : recommendedItems = [], isLoading, error} = useQuery({
        queryKey: ['recommendedItems'],
        queryFn: () => postAPI.getTopPurchasedItems(4),
        staleTime: 5* 60 * 1000
    })

    return {recommendedItems, isLoading, error};
}