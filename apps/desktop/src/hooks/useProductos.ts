import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../services";

export const useProductos = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
};
