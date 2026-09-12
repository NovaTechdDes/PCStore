// Marca, Proveedor, Categoria, Unidad Medida

import { Categoria, Marca, Provedor, UnidadMedida } from "../interface";
import api from "./api.service";

export const getDatos = async () => {
  try {
    const [marcasRes, proveedoresRes, categoriasRes, unidadesRes, dolarRes] = await Promise.all([
      api.get("/marcas"),
      api.get("/proveedores"),
      api.get("/categorias"),
      api.get("/unidades"),
      api.get("/configuracion/dolar")
    ]);


    const datos: {
      marcas: Marca[];
      proveedores: Provedor[];
      categorias: Categoria[];
      unidades: UnidadMedida[];
      dolar: {
        Valor: number
      };
    } = {
      marcas: [],
      proveedores: [],
      categorias: [],
      unidades: [],
      dolar: {
        Valor: 0
      }
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

    if (unidadesRes.data.ok) {
      datos.unidades = unidadesRes.data.data;
    }

    if (dolarRes.data.ok) {
      datos.dolar = dolarRes.data.data;
    }
    return datos;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
