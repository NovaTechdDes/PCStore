import { create } from "zustand";
import { ProductoCarrito } from "../interface";



interface VentaState {
    ventaData: {
        clienteId: number,
        esNotaCredito: boolean,
        tipoPago: string,
        tipoVenta: string,
        descuento: number,
        impresion: boolean,
        dolar: boolean,
        facturado: boolean,
        codigoAux: string,
    };
    productosCarrito: ProductoCarrito[];
    productoSeleccionado: ProductoCarrito | null;

    setVentaData: (data: {
        clienteId: number,

        descuento: number,
        impresion: boolean,
        dolar: boolean,
        facturado: boolean,
        codigoAux: string,

        esNotaCredito: boolean,
        tipoPago: string
        tipoVenta: string
    }) => void;

    addProductoCarrito: (producto: ProductoCarrito) => void;
    removeProductoCarrito: (id: number) => void;
    updateProductoCarrito: (id: number, producto: ProductoCarrito) => void;

    setProductoSeleccionado: (producto: ProductoCarrito) => void;
    clearProductosCarrito: () => void;
    resetVenta: () => void;

    agregarSerie: (id: number, series: string) => void;
};

export const useVentaStore = create<VentaState>((set) => ({
    ventaData: {
        clienteId: 1,
        esNotaCredito: false,
        tipoPago: 'CD',
        tipoVenta: 'Contado',
        descuento: 0,
        impresion: false,
        dolar: false,
        facturado: false,
        codigoAux: '',

    },
    productosCarrito: [],
    productoSeleccionado: null,

    setVentaData: (data) => set({ ventaData: data }),

    addProductoCarrito: (producto) => set((state) => ({ productosCarrito: [...state.productosCarrito, producto] })),
    removeProductoCarrito: (id) => set((state) => ({ productosCarrito: state.productosCarrito.filter((p) => p.id !== id) })),
    updateProductoCarrito: (id, producto) => set((state) => ({ productosCarrito: state.productosCarrito.map((p) => (p.id === id ? producto : p)) })),

    setProductoSeleccionado: (producto) => set({ productoSeleccionado: producto }),
    clearProductosCarrito: () => set({ productosCarrito: [] }),
    resetVenta: () => set({ ventaData: { clienteId: 0, esNotaCredito: false, tipoPago: 'CD', tipoVenta: 'VENTA', descuento: 0, impresion: false, dolar: false, facturado: false, codigoAux: '' }, productosCarrito: [] }),

    agregarSerie: (id, series) => set((state) => ({ productosCarrito: state.productosCarrito.map((p) => (p.id === id ? { ...p, series } : p)) })),
}));