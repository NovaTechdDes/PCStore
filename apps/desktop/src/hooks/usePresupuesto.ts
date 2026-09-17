import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postPresupuesto } from "../services/presupuesto.service";
import { CreatePresupuesto, ProductoCarrito } from "../interface";
export const startPostPresupuesto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({presupuesto, productos, facturado}: {presupuesto: CreatePresupuesto, productos: ProductoCarrito[], facturado: boolean}) => {
            return postPresupuesto(presupuesto, productos, facturado)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
        }
    })
}