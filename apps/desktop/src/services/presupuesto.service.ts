import { CreatePresupuesto, Presupuesto, ProductoCarrito } from "../interface";
import api from "./api.service";

export const postPresupuesto = async (presupuesto: CreatePresupuesto, productos: ProductoCarrito[], facturado: boolean): Promise<{ok: boolean, presupuesto?: Presupuesto}> => {
   try {
    const { data } = await api.post('/presupuestos',  {presupuesto, productos, facturado})

    if(data.ok){
        return {
            ok: true,
            presupuesto: data.data
        }
    }

    return {ok: false}
   } catch (error) {
    console.error(error);
    throw new Error("Error al crear el presupuesto");
   }
};

export const getPresupuestos = async(): Promise<Presupuesto[] | null> => {
  try {
    const { data } = await api.get(`/presupuestos`)
    if(data.ok){
      return data.data
    }
    return null
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener los presupuestos");
  }
}

export const getPresupuestoById = async(id: number): Promise<Presupuesto | null> => {
  try {
    const { data } = await api.get(`/presupuestos/${id}`)
    if(data.ok){
      return data.data
    }
    return null
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el presupuesto");
  }
}
