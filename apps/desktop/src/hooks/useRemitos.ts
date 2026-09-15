import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useRemitos = (clienteId: string) => {
    return useQuery({
        queryKey: ["remitos", clienteId],
        queryFn: async () => {
            return
        }
    })
};

export const startPostRemito = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const {remito, productos, ...res} = data;

            const resp = await fetch("", {method: "POST", body: JSON.stringify(remito)})
        }
    })
}