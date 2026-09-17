import { CreateVenta, Venta, ProductoCarrito, MetodoPagoDetalle } from "../interface";
import api from "./api.service";

export const postVenta = async (venta: CreateVenta, metodosPagos: MetodoPagoDetalle[], productos: ProductoCarrito[], facturado: boolean, descontarStock: boolean, esNotaCredito: boolean): Promise<{ok: boolean, venta?: Venta}> => {
   try {
    const { data } = await api.post('/ventas',  {venta, metodosPagos, productos, facturado, descontarStock, esNotaCredito})

    if(data.ok){
        return {
            ok: true,
            venta: data.venta
        }
    }

    return {ok: false}
   } catch (error) {
    console.error(error);
    throw new Error("Error al crear la venta");
   }
}
