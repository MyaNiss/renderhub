import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {boardAPI} from "../service/boardService.jsx";
import {useEffect, useState} from "react";
import {date} from "yup";


export const useGetBoardDetail = (id) => {
    return useQuery({
        queryKey: ['board', id],
        queryFn: () => boardAPI.getBoardDetail(id),
        enabled: !!id
    })
}

export const useBoard = () => {
    const queryClient = useQueryClient();

    const createBoardMutation = useMutation({
        mutationFn: (formData) => boardAPI.write(formData),
        onSuccess: () => {
            console.log ("Write board");

            alert("게시글이 성공적으로 등록되었습니다");

            queryClient.invalidateQueries({queryKey : ['boardList', 0]});
        }
    })


    const updateBoardMutation = useMutation({
        mutationFn: (formData) => boardAPI.update(formData),
        onSuccess: (data, formData) => {
            const id = formData.get('id');
            queryClient.invalidateQueries({queryKey : ['board', id]});
            queryClient.invalidateQueries({queryKey : ['boardList', 0]});
        }
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (id) => boardAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['boardList', 0]});
        }
    })

    return {createBoardMutation, updateBoardMutation, deleteBoardMutation};
}