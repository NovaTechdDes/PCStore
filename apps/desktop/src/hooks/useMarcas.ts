import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteMarca, getMarcas, postMarca, putMarca } from "../services"
import { CrearMarcaDTO } from "../interface";

export const useMarcas = () => {
    return useQuery({
        queryKey: ['marcas'],
        queryFn: getMarcas
    })
};

export const usePutMarca = () => {
    const query = useQueryClient();

    return useMutation({
        mutationFn: ({data, id}: {data: CrearMarcaDTO, id: number}) => putMarca(data, id),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['marcas'] })
        }
    })
}

export const useStartPostMarca = () => {
    const query = useQueryClient();

    return useMutation({
        mutationFn: (data: CrearMarcaDTO) => postMarca(data),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['marcas'] })
        }
    })
}

export const useStartDeleteMarca = () => {
    const query = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteMarca(id),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['marcas'] })
        }
    })
}