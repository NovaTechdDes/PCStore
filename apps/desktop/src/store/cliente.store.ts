import {   ClienteBackEnd } from "../interface";
import { create } from 'zustand';

interface ClienteState {

    buscadorCliente: string;
    setBuscadorCliente: (texto: string) => void;

    clienteSeleccinado: ClienteBackEnd | null;
    setCliente: (cliente: ClienteBackEnd | null) => void;

}

export const useClienteStore = create<ClienteState>((set) => ({
    

    buscadorCliente: '',
    setBuscadorCliente: (texto: string) => set({ buscadorCliente: texto }),

    clienteSeleccinado: null,
    setCliente: (cliente: ClienteBackEnd | null) => set({ clienteSeleccinado: cliente }),

   


}))