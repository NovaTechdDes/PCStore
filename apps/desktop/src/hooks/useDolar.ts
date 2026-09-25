import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarDolar, getDolar } from "../services";
import { useGlobalStore } from "../store";

export const useDolar = () => {
  return useQuery({
    queryKey: ["configuracion", "dolar"],
    queryFn: getDolar,
  });
};

export const useActualizarDolar = () => {
  const queryClient = useQueryClient();
  const setDolar = useGlobalStore((state) => state.setDolar);

  return useMutation({
    mutationFn: (valor: number) => actualizarDolar(valor),
    onSuccess: (_, nuevoValor) => {
      setDolar(nuevoValor);
      // Invalida consultas que dependen del dólar
      queryClient.invalidateQueries({ queryKey: ["configuracion", "dolar"] });
      queryClient.invalidateQueries({ queryKey: ["datos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};
