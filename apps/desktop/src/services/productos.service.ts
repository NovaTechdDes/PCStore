import { ActualizarProductoDTO, AjustarStockDTO, CrearProductoDTO, Producto } from "../interface";
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

    // Si contiene un archivo File o indicador para eliminar imagen, enviamos formdata
    if(producto.imagen instanceof File || producto?.eliminarImagen){
      const formData = new FormData();
      Object.entries(producto).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (key === 'imagen' && val instanceof File) {
            formData.append('imagen', val);
          } else if (typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });
      const { data } = await api.post('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.ok) {
        return { ok: true, msg: 'Producto creado correctamente' };
      }
      return { ok: false, msg: data.msg || 'Error al crear el producto' };
    }
    
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

export const actualizarProducto = async (producto: ActualizarProductoDTO): Promise<{ ok: boolean; msg: string }> => {
  try {
    const id = producto.Id ?? producto.id;
    const url = id ? `/productos/${id}` : '/productos';

    // Si contiene un archivo File o indicador para eliminar imagen, enviamos FormData
    if (producto.imagen instanceof File || producto.eliminarImagen) {
      const formData = new FormData();
      Object.entries(producto).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (key === 'imagen' && val instanceof File) {
            formData.append('imagen', val);
          } else if (typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });
      const { data } = await api.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.ok) {
        return { ok: true, msg: 'Producto actualizado correctamente' };
      }
      return { ok: false, msg: data.msg || 'Error al actualizar el producto' };
    }

    const { data } = await api.put(url, producto);
    if (data.ok) {
      return { ok: true, msg: 'Producto actualizado correctamente' };
    }
    return { ok: false, msg: data.msg || 'Error al actualizar el producto' };
  } catch (error: any) {
    console.error(error);
    return { ok: false, msg: error.response?.data?.msg || 'Error al actualizar el producto' };
  }
};

export const subirImagenProducto = async (
  productoId: number,
  file: File
): Promise<{ ok: boolean; msg: string; data?: any }> => {
  try {
    const formData = new FormData();
    formData.append('imagen', file);
    const { data } = await api.post(`/productos/${productoId}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error: any) {
    console.error(error);
    return { ok: false, msg: error.response?.data?.msg || 'Error al subir la imagen' };
  }
};

export const eliminarImagenProducto = async (
  productoId: number,
  imagenId?: number
): Promise<{ ok: boolean; msg: string }> => {
  try {
    const url = imagenId ? `/productos/${productoId}/imagen/${imagenId}` : `/productos/${productoId}/imagen`;
    const { data } = await api.delete(url);
    return data;
  } catch (error: any) {
    console.error(error);
    return { ok: false, msg: error.response?.data?.msg || 'Error al eliminar la imagen' };
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

export const getProductoVenta = async(codigo: string) => {
  try {
    const { data } = await api.get(`/productos/venta/${codigo}`);

    console.log(data)

    if(data.ok){
      return data.data
    }
    return null;
  } catch (error) {
    console.error(error)
    throw error
  }
};