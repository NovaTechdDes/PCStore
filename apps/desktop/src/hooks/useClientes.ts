import { useQuery } from "@tanstack/react-query"

export const useClientes = () => {
    return useQuery({
        queryKey: ['clientes'],
        queryFn: () => {
            return 
        }
    })
}
export const useClienteById = (idCliente: number) => {
    return useQuery({
        queryKey: ['clientes', idCliente],
        queryFn: () => {
            return 
        }
    })
}