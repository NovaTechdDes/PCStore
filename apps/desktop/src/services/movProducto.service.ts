
import { Movimiento, MovimientoBackend } from "../interface/Movimiento"
import api from "./api.service"


export const postMovimiento = async (movimientos: Movimiento[]) => {
    try {
        const { data } = await api.post('/movimiento/movimientoManoObra', movimientos);

        if(data.ok){
            return true
        }
        return false
    } catch (error) {
        console.error(error)
    }
};

export const getMovProducto = async (id: number): Promise<MovimientoBackend[] | {ok: false, msg: string}> => {
    try {
        const { data } = await api.get(`/movimientos`, {
            params: {
                productoId: id
            }
        });
        console.log(id)
        console.log(data)
        if(data.ok){
            return data.data
        }
        return []
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            msg: 'Error al obtener los movimients' + error, 
        }
    }
}
