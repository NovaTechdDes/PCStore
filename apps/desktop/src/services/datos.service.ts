// Marca, Proveedor, Categoria, Unidad Medida

import { Categoria, Marca, Provedor } from "../interface";
import api from "./api.service";

export const getDatos = async () => {
  try {
    const [marcasRes, proveedoresRes, categoriasRes] = await Promise.all([
      api.get("/marcas"),
      api.get("/proveedores"),
      api.get("/categorias"),
    ]);

    console.log(proveedoresRes.data);
    console.log(categoriasRes.data);

    const datos: {
      marcas: Marca[];
      proveedores: Provedor[];
      categorias: Categoria[];
    } = {
      marcas: [],
      proveedores: [],
      categorias: [],
    };

    if (marcasRes.data.ok) {
      datos.marcas = marcasRes.data.data;
    }

    if (proveedoresRes.data.ok) {
      datos.proveedores = proveedoresRes.data.data;
    }

    if (categoriasRes.data.ok) {
      datos.categorias = categoriasRes.data.data;
    }
    return datos;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
