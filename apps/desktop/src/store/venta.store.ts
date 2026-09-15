import { create } from "zustand";

interface VentaState {
    ventaData: {
        clienteId: number
    };

    setVentaData: (data: {
        clienteId: number
    }) => void;
};

export const useVentaStore = create<VentaState>((set) => ({
    ventaData: {
        clienteId: 0
    },

    setVentaData: (data) => set({ ventaData: data })
}));