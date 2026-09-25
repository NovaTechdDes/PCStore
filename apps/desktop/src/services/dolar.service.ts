import api from "./api.service";
import { ValorDolar } from "../interface";

export const getDolar = async (): Promise<ValorDolar> => {
  try {
    const { data } = await api.get("/configuracion/dolar");
    if (data.ok) {
      return data.data;
    }
    return { Clave: "Dolar", Valor: 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const actualizarDolar = async (valor: number): Promise<{ ok: boolean; msg: string; data?: ValorDolar }> => {
  try {
    const { data } = await api.put("/configuracion/dolar", { valor });
    if (data.ok) {
      return { ok: true, msg: "Cotización del dólar actualizada correctamente", data: data.data };
    }
    return { ok: false, msg: data.msg || "No se pudo actualizar la cotización" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
