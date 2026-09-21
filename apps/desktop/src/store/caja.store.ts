
import { create } from 'zustand';

interface CajaState {

    buscador: string;
    setBuscador: (buscador: string) => void;

    desde: string;
    hasta: string;

    setDesde: (desde: string) => void;
    setHasta: (hasta: string) => void;

}

export const useCajaStore = create<CajaState>((set) => ({

    buscador: '',
    setBuscador: (buscador: string) => set({ buscador }),

    desde: new Date().toISOString().slice(0, 10),
    hasta: new Date().toISOString().slice(0, 10),


    setDesde: (desde: string) => set({ desde }),
    setHasta: (hasta: string) => set({ hasta }),

   


}))