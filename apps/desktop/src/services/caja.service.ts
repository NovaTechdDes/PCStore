import api from "./api.service";

export const getCajaForDay = async (desde: string, hasta: string, desactivados: boolean) => {
    try {

        const { data } = await api.get(`caja/dia/${desde}/${hasta}`, { params: { desactivados } })
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

export const activarCaja = async (id: number, tipo: string) => {
    try {
        const { data } = await api.patch('caja/activar', {}, {
            params: {
                id,
                tipo
            }
        })


        if (!data.ok) {
            return {
                ok: false,
                msg: data.msg
            }
        }

        return data

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            msg: 'error al desactivar'
        }
    }
};

export const desactivarCaja = async (id: number, tipo: string) => {

    try {
        const { data } = await api.patch('caja/desactivar', {}, {
            params: {
                id,
                tipo
            }
        })

        

        if (!data.ok) {
            return {
                ok: false,
                msg: data.msg
            }
        }

        return data

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            msg: 'error al desactivar'
        }
    }
};
