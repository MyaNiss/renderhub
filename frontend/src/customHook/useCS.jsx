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

    const writeCsMutation = useMutation({
        mutationFn: (formData) => csAPI.write(formData),
        onSuccess: () => {

            queryClient.invalidateQueries({queryKey : ['csList', 0]});
        }
    });

    const updateCsMutation = useMutation({
        mutationFn: (formData) => csAPI.update(formData),
        onSuccess: (data, formData) => {
            queryClient.invalidateQueries({queryKey : ['csList', 0]});

            const csId = formData.get('csId');
            if(csId) {
                queryClient.invalidateQueries({queryKey: ['csId', formData.csId]});
            }
        }
    });

    const deleteCsMutation = useMutation({
        mutationFn: (csId) => csAPI.delete(csId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['csList', 0]});
        }
    });

    return { writeCsMutation, updateCsMutation, deleteCsMutation };
}