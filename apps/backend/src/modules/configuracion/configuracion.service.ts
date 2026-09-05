import { getPool, sql } from '../../config/db';

export const obtenerValorClave = async(clave: string): Promise<number> => {
    const pool = await getPool();
    const result = await pool.request()
    .input('clave', sql.NVarChar(50), clave)
    .query('SELECT valor FROM Configuracion WHERE clave = @clave');

    if(result.recordset.length === 0){
        throw {status: 404, msg: `No existe configuracion para la clave '${clave}'`};
    }

    return Number(result.recordset[0].valor)
};


