import { useQuery } from "@tanstack/react-query";
import { getDatos } from "../services/datos.service";

export const useDatos = () => {
  return useQuery({
    queryKey: ["datos", "marcas", "proveedores", "categorias"],
    queryFn: getDatos,
  });
};
