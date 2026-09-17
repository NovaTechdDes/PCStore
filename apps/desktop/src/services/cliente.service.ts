import { Cliente, ClienteBackEnd } from "../interface";
import api from "./api.service";

export const clienteById = async (id: number) => {
    try {
        const { data } = await api.get(`/clientes/${id}`)
        
        return data.data?.cliente ?? data.data;
    } catch (error) {
        throw error;
    }
};

export const getClientes = async (texto: string): Promise<ClienteBackEnd[]> => {
    try {
        const { data } = await api.get(`/clientes?buscar=${encodeURIComponent(texto)}`)
        return data.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export const postCliente = async (cliente: Cliente): Promise<boolean>=> {
    try {
        const { data } = await api.post(`/clientes`, cliente);
        return data.ok;
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export const putCliente = async (cliente: Cliente, id: number): Promise<boolean> => {
    try {
        const { data } = await api.put(`/clientes/${id}`, cliente)
        return data.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteCliente = async (id: number): Promise<boolean> => {
    try {
        const { data } = await api.delete(`/clientes/${id}`)
        return data.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
}