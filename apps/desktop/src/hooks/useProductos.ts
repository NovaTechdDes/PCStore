import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarStock, getProductos } from "../services";
import { Movimiento } from "../interface";

export const useProductos = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
};


export const startActualizarStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { data: Movimiento }) => actualizarStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  })
}