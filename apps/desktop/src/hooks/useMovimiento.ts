import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Movimiento } from "../interface/Movimiento";
import { getMovProducto, postMovimiento } from "../services";

export const startPostMovimiento = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Movimiento[]) => postMovimiento(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['manoObra']}),
            queryClient.invalidateQueries({queryKey: ['movimientos']})
        }
    })
}

export const startGetMov = (id: number) => {
    return useQuery({
        queryKey: ['movimientos'],
        queryFn: () => getMovProducto(id),
        refetchOnMount: true,
        refetchOnWindowFocus: true
    })
}

