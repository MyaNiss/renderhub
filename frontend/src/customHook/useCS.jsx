import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {csAPI} from "../service/customerserviceService.jsx";


export const useGetCSDetail = (csId) => {
    return useQuery({
        queryKey: ['cs', csId],
        queryFn: () => csAPI.getCsDetail(csId),
        enabled: !!csId
    });
};

export const useCS = () => {
    const queryClient = useQueryClient();

    const writeCSMutation = useMutation({
        mutationFn: (formData) => csAPI.write(formData),
        onSuccess: () => {
            console.log ("Write cs");

            alert("게시글이 성공적으로 등록되었습니다");

            queryClient.invalidateQueries({queryKey : ['csList', 0]});
        }
    });

    const updateCSMutation = useMutation({
        mutationFn: (formData) => csAPI.update(formData),
        onSuccess: (data, formData) => {
            queryClient.invalidateQueries({queryKey : ['csList', 0]});

            const csId = formData.get('Id');
            if(csId) {
                queryClient.invalidateQueries({queryKey: ['csId', formData.id]});
            }
            alert("문의글이 성공적으로 수정되었습니다");
        }
    });

    const deleteCSMutation = useMutation({
        mutationFn: (csId) => csAPI.delete(csId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['csList', 0]});
        }
    });

    return { writeCSMutation, updateCSMutation, deleteCSMutation };
}