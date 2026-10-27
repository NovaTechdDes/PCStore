import api from "./api.service";

export const getCajaForDay = async (desde: string, hasta: string,tipo:string) => {
    try {

        const { data } = await api.get(`cajas`, {
            params: {
                desde,
                hasta,
                tipo,
            }
        })
        if (data.ok) {
            return data
        }
        return []
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            msg: error
        }
    }
};

