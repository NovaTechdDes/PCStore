import { useMutation, useQueryClient } from "@tanstack/react-query";

export const startPostVenta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const {remito, productos, ...res} = data;

            const resp = await fetch("", {method: "POST", body: JSON.stringify(remito)})
        }
    })
}