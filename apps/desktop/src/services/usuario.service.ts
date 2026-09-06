import { Usuario } from "../interface/Usuario";
import api from "./api.service";

export const login = async (password: string): Promise<Usuario | null> => {
  try {
    const { data } = await api.post(`usuarios/login`, { password });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
