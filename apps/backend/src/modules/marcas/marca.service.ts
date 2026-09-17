import { getPool, sql } from "../../config/db";
import { ActualizarMarcaDTO, CrearMarcaDTO } from "./marcas.schema";

export const listarMarcas = async (soloActivas = true) => {
    const pool = await getPool();
    const query = soloActivas 
                    ? 'SELECT m.*, (SELECT COUNT(1) FROM Productos p WHERE p.MarcaId = m.Id) as TotalProductos FROM Marcas m WHERE m.Activo = 1 ORDER BY m.Nombre'
                    : 'SELECT m.*, (SELECT COUNT(1) FROM Productos p WHERE p.MarcaId = m.Id) as TotalProductos FROM Marcas m ORDER BY m.Nombre'
    const result = await pool.request().query(query);
    return result.recordset
};

export const obtenerMarcaPorId = async(id: number) => {
    const pool = await getPool();   
    const query = 'SELECT * from Marcas WHERE id = @id';
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
    const query = `UPDATE Marcas SET nombre = COALESCE(@nombre, nombre), sitioWeb = COALESCE(@sitioWeb, sitioWeb), Descripcion = COALESCE(@Descripcion, Descripcion), Activo = COALESCE(@Activo, Activo) OUTPUT INSERTED.* where id = @id`;
    const result = await pool.request().input('id', sql.Int, id).input('nombre', sql.NVarChar(100), marca.nombre).input('sitioWeb', sql.NVarChar(255), marca.sitioWeb).input('Descripcion', sql.NVarChar(255), marca.descripcion).input('Activo', sql.Bit, marca.activo).query(query);
    return result.recordset[0] ?? null;
};

export const eliminarMarca = async(id: number) => {
    const pool = await getPool();
    const query = `UPDATE Marcas SET Activo = 0 OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool.request().input('id', sql.Int, id).query(query);
    return result.recordset[0] ?? null;
}
