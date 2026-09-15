import { CrearMarcaDTO, Marca } from "../interface";
import api from "./api.service";

export const getMarcas = async (): Promise<Marca[]> => {
  try {
    const { data } = await api.get("/marcas");

    if (data.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const postMarca = async (marca: CrearMarcaDTO): Promise<Marca> => {
    try {

      console.log(marca)
        const { data } = await api.post('/marcas', marca);



        if(data.ok){
          return data.data;
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const putMarca = async (marca: CrearMarcaDTO, id:number): Promise<Marca> => {
    try {
        const { data } = await api.put(`/marcas/${id}`, marca);

        if(data.ok){
          return data.data;
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteMarca = async (id: number): Promise<Marca> => {
    try {
        const { data } = await api.delete(`/marcas/${id}`);

        if(data.ok){
          return data.data;
        }

        throw new Error(data.message);
    } catch (error) {
        console.error(error);
        throw error;
    }
}