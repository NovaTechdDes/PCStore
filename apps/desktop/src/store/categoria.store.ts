import { create } from "zustand";
import { Categoria } from "../interface";

interface CategoriaState {
    categoria: Categoria | null;
    setCategoria: (categoria: Categoria | null) => void;
    
    modalAbierto: boolean;
    setModalAbierto: (modalAbierto: boolean) => void;
};

export const usecategoriaStore = create<CategoriaState>((set) => ({
    categoria: null,
    setCategoria: (categoria: Categoria | null) => set({ categoria }),
    
    modalAbierto: false,
    setModalAbierto: (modalAbierto: boolean) => set({ modalAbierto }),
}))