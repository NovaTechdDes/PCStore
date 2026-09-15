import { create } from "zustand";
import { Provedor } from "../interface";

interface ProveedorState {
  proveedor: Provedor | null;
  setProveedor: (proveedor: Provedor | null) => void;

  modalAbierto: boolean;
  setModalAbierto: (modalAbierto: boolean) => void;
}

export const useProveedorStore = create<ProveedorState>((set) => ({
  proveedor: null,
  setProveedor: (proveedor: Provedor | null) => set({ proveedor }),

  modalAbierto: false,
  setModalAbierto: (modalAbierto: boolean) => set({ modalAbierto }),
}));
