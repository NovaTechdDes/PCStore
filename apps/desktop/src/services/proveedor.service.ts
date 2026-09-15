import { ActualizarProvedorDTO, CrearProvedorDTO, Provedor } from "../interface";
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

export const postProveedor = async (proveedor: CrearProvedorDTO): Promise<boolean> => {
  try {
    const { data } = await api.post('/proveedores', proveedor);

    if (data.ok) {
      return true;
    }

    throw new Error(data.message);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const putProveedor = async (proveedor: ActualizarProvedorDTO, id: number): Promise<boolean> => {
  try {
    const { data } = await api.put(`/proveedores/${id}`, proveedor);

    if (data.ok) {
      return true;
    }

    throw new Error(data.message);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteProveedor = async (id: number): Promise<boolean> => {
  try {
    const { data } = await api.delete(`/proveedores/${id}`);

    if (data.ok) {
      return true;
    }

    throw new Error(data.message);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
