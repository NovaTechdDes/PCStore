import { UnidadMedida } from "../interface";
import api from "./api.service";

export const getUnidades = async (): Promise<UnidadMedida[]> => {
  try {
    const { data } = await api.get("/unidades");

    if (data.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
