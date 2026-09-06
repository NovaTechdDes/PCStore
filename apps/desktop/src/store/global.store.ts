import { create } from "zustand";
import { Usuario } from "../interface/Usuario";

interface GlobalState {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;

  dolar: number;
  setDolar: (dolar: number) => void;
}
export const useGlobalStore = create<GlobalState>((set) => ({
  usuario: null,
  setUsuario: (usuario: Usuario | null) => set({ usuario }),

  dolar: 1,
  setDolar: (dolar: number) => set({ dolar }),
}));
