import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  activarCaja, desactivarCaja, getCajaForDay } from "../services/caja.service"

export const useCajas = (desde: string, hasta: string, tipo: string) => {
    return useQuery({
        queryKey: ['caja', desde, hasta, tipo],
        queryFn: () => getCajaForDay(desde, hasta, tipo),
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