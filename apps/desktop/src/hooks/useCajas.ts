import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  activarCaja, desactivarCaja, getCajaForDay } from "../services/caja.service"

export const useCajas = (desde: string, hasta: string, desactivados: boolean) => {
    return useQuery({
        queryKey: ['caja', desde, hasta, desactivados],
        queryFn: () => getCajaForDay(desde, hasta, desactivados),
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: !!desde && !!hasta
    })
}


export const startDesactviarCaja = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tipo }: { id: number, tipo: string }) => desactivarCaja(id, tipo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caja'] });
        }
    })
}
export const startActivarCaja = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tipo }: { id: number, tipo: string }) => activarCaja(id, tipo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caja'] });
        }
    })
}