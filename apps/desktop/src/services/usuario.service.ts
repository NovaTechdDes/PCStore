import { Usuario } from "../interface/Usuario";
import api from "./api.service";

export const login = async (password: string): Promise<Usuario | null> => {
  try {
    const { data } = await api.post(`/usuarios/login`, { password });
    const usuario = data.data.usuario;
    const token = data.data.token;

    return {
      Id: usuario.id,
      NombreUsuario: usuario.nombreUsuario,
      Rol: usuario.rol,
      token,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
