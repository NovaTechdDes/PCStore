import { create } from "zustand";
import { Producto } from "../interface";


interface ProductoState {
  buscadorProducto: string;
  setBuscadorProducto: (texto: string) => void;

  productoSeleccionado: Producto | null;
  setProducto: (producto: Producto | null) => void;
}

export const useProductoStore = create<ProductoState>((set) => ({
  buscadorProducto: "",
  productoSeleccionado: null,

  setBuscadorProducto: (texto: string) => set({ buscadorProducto: texto }),
  setProducto: (producto: Producto | null) =>
    set({ productoSeleccionado: producto }),
}));
