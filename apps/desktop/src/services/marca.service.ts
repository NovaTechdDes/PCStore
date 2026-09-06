import { Marca } from "../interface";
import api from "./api.service";

export const getMarcas = async (): Promise<Marca[]> => {
  try {
    const { data } = await api.get("/marcas");

    if (data.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
