import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActualizarProvedorDTO, CrearProvedorDTO, Provedor } from "../interface";
import { deleteProveedor, getProveedores, postProveedor, putProveedor } from "../services";

export const useProveedores = () => {
  return useQuery<Provedor[]>({
    queryKey: ['proveedores'],
    queryFn: getProveedores,
  });
};

export const useStartPostProveedor = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (data: CrearProvedorDTO) => postProveedor(data),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};

export const useStartPutProveedor = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: ActualizarProvedorDTO; id: number }) => putProveedor(data, id),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};

export const useStartDeleteProveedor = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProveedor(id),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};
