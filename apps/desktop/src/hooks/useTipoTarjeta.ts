import { useQuery } from "@tanstack/react-query"

export const useTipoTarjetas = () => {
    return useQuery({
        queryKey: ['tipoTarjetas']
    })
}