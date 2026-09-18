import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { activeCliente, clienteById, deleteCliente, getClientes, nextCliente, postCliente, putCliente } from "../services"
import { CreateCliente } from "../interface"
import { useDebounce } from "./useDebounce";


export const useClientes = (texto: string) => {
    const debouncedValue = useDebounce(texto, 350);
    return useQuery({
        queryKey: ['clientes', debouncedValue],
        queryFn: () => {
            return getClientes(debouncedValue)
        }
    })
}
export const useCodigoNext = () => {
    return useQuery({
        queryKey: ['clientes', 'next'],
        queryFn: () => {
            return nextCliente()
        }
    })
}
export const useClienteById = (idCliente: number) => {
    return useQuery({
        queryKey: ['clientes', idCliente],
        enabled: idCliente !== 0,
        retry: false,
        queryFn: () => {
            return clienteById(idCliente)
        }
    })
}

export const useStartPostCliente = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: (cliente: CreateCliente) => {
            return postCliente(cliente)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
        }
    })
}

export const useStartPutCliente = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: ({cliente, id}: {cliente: CreateCliente, id: number}) => {
            return putCliente(cliente, id)
        },
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
        }
    })
}

export const useStartDeleteCliente = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: (id: number) => {
            return deleteCliente(id)
        },
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
        }
    })
}

export const useStartActivateCliente = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: (id: number) => {
            return activeCliente(id)
        },
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
        }
    })
}