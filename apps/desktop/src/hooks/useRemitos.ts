import { useMutation, useQuery } from "@tanstack/react-query"

export const useRemitos = (clienteId: string) => {
    return useQuery({
        queryKey: ["remitos", clienteId],
        queryFn: async () => {
            return
        }
    })
};

export const startPostRemito = () => {

    return useMutation({
        mutationFn: async (data: any) => {
            const {remito, productos, ...res} = data;
            console.log(res)
            await fetch("", {method: "POST", body: JSON.stringify(remito)})
        }
    })
}