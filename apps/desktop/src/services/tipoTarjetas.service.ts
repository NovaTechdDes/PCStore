
import { TipoTarjeta } from "../interface";
import api from "./api.service";

export const getTipoTarjetas = async (): Promise<TipoTarjeta[]> => {
    try {
        const { data } = await api.get('/tipo-tarjetas');
        if(data.ok){
            return data.data;
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }

}