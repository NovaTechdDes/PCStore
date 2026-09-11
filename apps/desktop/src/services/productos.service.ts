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


export const actualizarStock = async(datos: any): Promise<{ok: boolean, msg: string}> => {
  try {
    const {productoId, stock, tipo, descripcion, vendedor, cant} = datos;
    
    const { data } = await api.put(`/productos/actualizarStock/${productoId}`, { productoId, stock, tipo, descripcion, vendedor, cant})
    if(data.ok){
        return {ok: true, msg: 'Stock actualizado correctamente'};
    }
    return {ok: false, msg: 'Error al actualizar el stock'};
  } catch (error) {
    console.error(error)
    throw error;
  }
}