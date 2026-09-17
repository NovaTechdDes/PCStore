import { AjustarStockDTO, CrearProductoDTO, Producto } from "../interface";
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


export const crearProducto = async (producto: CrearProductoDTO): Promise<{ok: boolean, msg: string}> => {
  try {
    const { data } = await api.post('/productos', producto)
    
    if(data.ok){
      return {ok: true, msg: 'Producto creado correctamente'};
    }
    return {ok: false, msg: 'Error al crear el producto'};
  } catch (error) {
    console.error(error)
    throw error;
  }
};

export const actualizarStock = async (datos: AjustarStockDTO): Promise<{ ok: boolean; msg: string }> => {
  try {
    const { productoId, stock, tipo, descripcion, vendedor, cant, series } = datos;
    const { data } = await api.patch(`/movimientos/ajuste-stock`, { productoId, stock, tipo, descripcion, vendedor, cant, series });
    if (data.ok) {
      return { ok: true, msg: 'Stock actualizado correctamente' };
    }
    return { ok: false, msg: data.msg || 'Error al actualizar el stock' };
  } catch (error: any) {
    console.error(error);
    return { ok: false, msg: error.response?.data?.msg || 'Error al actualizar el stock' };
  }
};

export const getCodigoProducto = async(codigoInterno: string) => {
  try {
    const { data } = await api.get(`/productos/codigoInterno/${codigoInterno}`);

    if(data.ok){
      return data.data
    }
    return null;
  } catch (error) {
    console.error(error)
    throw error
  }
};

export const getProductoByCodigoBarras = async(codigoBarras: string) => {
  try {
    const { data } = await api.get(`/productos/codigoBarras/${codigoBarras}`);

    if(data.ok){
      return data.data
    }
    return null;
  } catch (error) {
    console.error(error)
    throw error
  }
};