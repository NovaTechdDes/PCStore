import { getPool, sql } from "../../config/db"
import { FiltrosClientesDTO } from "./clientes.schema";

export const clientesFiltrados = async(filtros: FiltrosClientesDTO) => {
    const pool = await getPool();
    const request = pool.request();

    const condiciones: string[] = [];

    if(filtros.todos !== 'true'){
        condiciones.push("c.Activo = 1")
    };

    if(filtros.buscar){
        request.input('buscar', sql.NVarChar(255), `%${filtros.buscar}%`);
        condiciones.push(
            "(c.Nombre LIKE @buscar OR c.Cuit LIKE @buscar OR c.Telefono LIKE @buscar OR c.Email LIKE @buscar)"
        )
    };

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

    const result =await request.query(`
        SELECT c.Id, c.Nombre, c.Cuit, c.CondicionIva, c.Telefono, c.Email, c.Activo
        FROM Clientes c
        ${where}
        ORDER BY c.Nombre
    `);

    return result.recordset;
};

export const obtenerClientePorId = async (id: Number) => {
    const pool = await getPool();

    const clienteResult = await pool.request().input('id', sql.Int, id).query(`
        SELECT c.*
        FROM Clientes c
        WHERE c.Id = @id;    
    `)

    const cliente = clienteResult?.recordset[0];
    if(!cliente){
        return null;
    };

    return {
        cliente
    }
}