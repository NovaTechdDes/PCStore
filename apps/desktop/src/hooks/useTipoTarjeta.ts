import { useQuery } from "@tanstack/react-query"
import { getTipoTarjetas } from "../services";

export const useTipoTarjetas = () => {
    return useQuery({
        queryKey: ['tipoTarjetas'],
        queryFn: () => getTipoTarjetas(),
    })
}