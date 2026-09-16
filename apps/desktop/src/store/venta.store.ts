import { create } from "zustand";
import { ProductoCarrito } from "../interface";



interface VentaState {
    ventaData: {
        clienteId: number,
        esNotaCredito: boolean,
        tipoPago: string,
        tipoVenta: string,

    };
    productosCarrito: ProductoCarrito[];

    setVentaData: (data: {
        clienteId: number,
        esNotaCredito: boolean,
        tipoPago: string
        tipoVenta: string
    }) => void;

    clearProductosCarrito: () => void;
    resetVenta: () => void;
};

export const useVentaStore = create<VentaState>((set) => ({
    ventaData: {
        clienteId: 0,
        esNotaCredito: false,
        tipoPago: 'CD',
        tipoVenta: 'VENTA'
    },

    setVentaData: (data) => set({ ventaData: data }),

    productosCarrito: [],
    clearProductosCarrito: () => set({ productosCarrito: [] }),
    resetVenta: () => set({ ventaData: { clienteId: 0, esNotaCredito: false, tipoPago: 'CD', tipoVenta: 'VENTA' }, productosCarrito: [] }),
}));