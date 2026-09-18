import { ClienteBackEnd, CreateCliente } from "../interface";
import api from "./api.service";

export const clienteById = async (id: number) => {
    try {
        const { data } = await api.get(`/clientes/${id}`)

        
        
        return data.data ?? data;
    } catch (error) {
        throw error;
    }
};

export const nextCliente = async (): Promise<string> => {
    try {
        const { data } = await api.get('/clientes/next');
        
        return data.siguiente;
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

export const postCliente = async (cliente: CreateCliente): Promise<boolean>=> {
    try {
        const { data } = await api.post(`/clientes`, cliente);
        return data.ok;
    } catch (error) {
        console.error(error)
        throw error;
    }
};

export const putCliente = async (cliente: CreateCliente, id: number): Promise<boolean> => {
    try {
        const { data } = await api.put(`/clientes/${id}`, cliente)
        return data.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCliente = async (id: number): Promise<boolean> => {
    try {
        const { data } = await api.delete(`/clientes/${id}`)
        return data.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const activeCliente = async (id: number): Promise<boolean> => {
    try {
        const { data } = await api.put(`/clientes/active/${id}`)
        return data.ok;
    } catch (error) {
        console.error(error);
        throw error;
    }
};