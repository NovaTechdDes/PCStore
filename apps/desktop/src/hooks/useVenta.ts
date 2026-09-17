import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateVenta, MetodoPagoDetalle, ProductoCarrito } from "../interface";
import { postVenta } from "../services/venta.service";

export const startPostVenta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({venta, metodosPagos, productos, facturado, descontarStock, esNotaCredito}: {venta: CreateVenta, metodosPagos: MetodoPagoDetalle[], productos: ProductoCarrito[], facturado: boolean, descontarStock: boolean, esNotaCredito: boolean}) => {
            return await postVenta(venta, metodosPagos, productos, facturado, descontarStock, esNotaCredito)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ventas'] })
            queryClient.invalidateQueries({ queryKey: ['productos'] })
        }
    })
}