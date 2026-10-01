import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPresupuestoById, getPresupuestos, postPresupuesto } from "../services/presupuesto.service";
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

export const usePresupuestos = () => {
    return useQuery({
        queryKey: ['presupuestos'],
        queryFn: () => getPresupuestos(),
    })
}

export const startGetPresupuestoById = (id: number) => {
    return useQuery({
        queryKey: ['presupuesto', id],
        queryFn: () => getPresupuestoById(id),
        enabled: !!id,
    })
}