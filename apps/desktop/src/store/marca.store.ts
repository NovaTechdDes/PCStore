import { create } from "zustand";
import { Marca } from "../interface";

interface MarcaState {
    marca: Marca | null;
    setMarca: (marca: Marca | null) => void;
    
    modalAbierto: boolean;
    setModalAbierto: (modalAbierto: boolean) => void;
};

export const useMarcaStore = create<MarcaState>((set) => ({
    marca: null,
    setMarca: (marca: Marca | null) => set({ marca }),
    
    modalAbierto: false,
    setModalAbierto: (modalAbierto: boolean) => set({ modalAbierto }),
}))