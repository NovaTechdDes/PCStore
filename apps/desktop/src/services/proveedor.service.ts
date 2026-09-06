import { Provedor } from "../interface";
import api from "./api.service";

export const getProveedores = async (): Promise<Provedor[]> => {
  try {
    const { data } = await api.get("/proveedores");

    if (data.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
