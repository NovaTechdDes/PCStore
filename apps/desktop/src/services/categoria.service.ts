import { ActualizarCategoriaDTO, Categoria, CrearCategoriaDTO } from "../interface";
import api from "./api.service";

export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const { data } = await api.get('/categorias');

        if (data.ok) {
            return data.data;
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const postCategoria = async(categoria: CrearCategoriaDTO): Promise<boolean> => {
    try {
        const { data } = await api.post('/categorias', categoria);

        if (data.ok) {
            return true
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const putCategoria = async (categoria: ActualizarCategoriaDTO, id: number): Promise<boolean> => {
    try {
        const { data } = await api.put(`/categorias/${id}`, categoria);

        if (data.ok) {
            return true
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCategoria = async (id: number): Promise<boolean> => {
    try {
        const { data } = await api.delete(`/categorias/${id}`);

        if(data.ok){
          return true;
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


