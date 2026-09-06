import { Producto } from "../interface";
import api from "./api.service";

export const getProductos = async (): Promise<Producto[]> => {
  try {
    const { data } = await api.get("/productos");

    if (data.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
