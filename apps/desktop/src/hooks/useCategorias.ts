import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Categoria, CrearCategoriaDTO } from "../interface";
import { deleteCategoria, getCategorias, postCategoria, putCategoria } from "../services";

export const useCategorias = () => {
    return useQuery<Categoria[]>({ 
        queryKey: ['categorias'],
        queryFn: getCategorias
    })
}


export const useStartPutCategoria = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: ({data, id}: {data: CrearCategoriaDTO, id:number}) => putCategoria(data, id),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['categorias'] });
        }
    })
};


export const useStartPostCategoria = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (data: CrearCategoriaDTO) => postCategoria(data),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['categorias'] });
        }
    })
}


export const useDeleteCategoria = () => {
    const query = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCategoria(id),
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['categorias'] });
        }
    })
}