import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarProducto, actualizarStock, crearProducto, getProductoVenta, getProductos } from "../services";
import { ActualizarProductoDTO, AjustarStockDTO, CrearProductoDTO } from "../interface";

export const useProductos = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });
};

export const startCrearProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: CrearProductoDTO) => crearProducto(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["productos"]})
    }
  })
}

export const startActualizarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: ActualizarProductoDTO) => actualizarProducto(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["productos"]})
    }
  })
}

export const startActualizarStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AjustarStockDTO) => actualizarStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  })
};

export const startGetProductoVenta = (codigo: string) => {
  return useQuery({
    queryKey: ["producto-venta", codigo],
    enabled: !!codigo,
    queryFn: () => getProductoVenta(codigo),
  });
};
