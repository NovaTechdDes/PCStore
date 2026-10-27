import { useQuery } from "@tanstack/react-query"
import { getCajaForDay } from "../services/caja.service"

export const useCajas = (desde: string, hasta: string, tipo: string) => {
    return useQuery({
        queryKey: ['caja', desde, hasta, tipo],
        queryFn: () => getCajaForDay(desde, hasta, tipo),
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: !!desde && !!hasta
    })
}
