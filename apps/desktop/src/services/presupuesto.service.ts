import { CreatePresupuesto, Presupuesto, ProductoCarrito } from "../interface";
import api from "./api.service";

export const postPresupuesto = async (presupuesto: CreatePresupuesto, productos: ProductoCarrito[], facturado: boolean): Promise<{ok: boolean, presupuesto?: Presupuesto}> => {
   try {
    const { data } = await api.post('/presupuestos',  {presupuesto, productos, facturado})

    if(data.ok){
        return {
            ok: true,
            presupuesto: data.presupuesto
        }
    }

    return {ok: false}
   } catch (error) {
    console.error(error);
    throw new Error("Error al crear el presupuesto");
   }
}
