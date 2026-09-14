import { getPool, sql } from "../../config/db";
import { ActualizarMarcaDTO, CrearMarcaDTO } from "./marcas.schema";

export const listarMarcas = async (soloActivas = true) => {
    const pool = await getPool();
    const query = soloActivas 
                    ? 'SELECT * FROM Marcas WHERE Activo = 1 ORDER BY Nombre'
                    : 'SELECT * FROM Marcas ORDER BY Nombre'
    const result = await pool.request().query(query);
    return result.recordset
};

export const obtenerMarcaPorId = async(id: number) => {
    const pool = await getPool();
    const query = 'SELECT * from Marcas Where id = @id';
    const result = await pool.request().input('id', sql.Int, id).query(query);
    return result.recordset[0] ?? null
};

export const crearMarca = async( marca: CrearMarcaDTO) => {
    const pool = await getPool();
    const query = `INSERT INTO Marcas (nombre, sitioWeb, Descripcion, Activo) OUTPUT INSERTED.* values (@nombre, @sitioWeb, @Descripcion, @Activo)`;
    const result = await pool.request().input('nombre', sql.NVarChar(100), marca.nombre).input('sitioWeb', sql.NVarChar(255), marca.sitioWeb).input('Descripcion', sql.NVarChar(255), marca.descripcion).input('Activo', sql.Bit, marca.activo).query(query);
    return result.recordset[0];
};

export const actualizarMarca = async(id: number, marca: ActualizarMarcaDTO) => {
    const pool = await getPool();
    const query = `UPDATE Marcas SET nombre = COALESCE(@nombre, nombre) OUTPUT INSERTED.* where id = @id`;
    const result = await pool.request().input('id', sql.Int, id).input('nombre', sql.NVarChar(100), marca.nombre).query(query);
    return result.recordset[0] ?? null;
};

export const eliminarMarca = async(id: number) => {
    const pool = await getPool();
    const query = `UPDATE Marcas SET Activo = 0 OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool.request().input('id', sql.Int, id).query(query);
    return result.recordset[0] ?? null;
}
