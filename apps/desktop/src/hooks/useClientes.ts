import { useMutation, useQuery } from "@tanstack/react-query"
import { clienteById, deleteCliente, getClientes, postCliente, putCliente } from "../services"
import { Cliente } from "../interface"


export const useClientes = (texto: string) => {
    return useQuery({
        queryKey: ['clientes', texto],
        queryFn: () => {
            return getClientes(texto)
        }
    })
}
export const useClienteById = (idCliente: number) => {
    return useQuery({
        queryKey: ['clientes', idCliente],
        queryFn: () => {
            return clienteById(idCliente)
        }
    })
}

export const useStartPostCliente = () => {
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: (cliente: Cliente) => {
            return postCliente(cliente)
        }
    })
}

export const useStartPutCliente = () => {
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: ({cliente, id}: {cliente: Cliente, id: number}) => {
            return putCliente(cliente, id)
        }
    })
}

export const useStartDeleteCliente = () => {
    return useMutation({
        mutationKey: ['clientes'],
        mutationFn: (id: number) => {
            return deleteCliente(id)
        }
    })
}