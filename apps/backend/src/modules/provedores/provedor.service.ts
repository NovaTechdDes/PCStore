import { getPool, sql } from "../../config/db"
import { ActualizarProvedorDTO, CrearProvedorDTO } from "./provedor.schema";

export const listarProvedores = async(soloActivas = true) => {
    const pool = await getPool();
    const query = soloActivas 
                    ? 'SELECT * FROM Proveedores WHERE Activo = 1 ORDER BY Nombre'
                    : 'SELECT * FROM Proveedores ORDER BY Nombre';
    const result = await pool.request().query(query);
    return result.recordset;
};

export const obtenerProvedorPorId = async(id: number) => {
    const pool = await getPool();
    const query = 'SELECT * FROM Proveedores WHERE id = @id';
    const result = await pool.request().input('id', sql.Int, id).query(query);
    return result.recordset[0] ?? null;
};

export const crearProvedor = async (provedor: CrearProvedorDTO) => {
    const pool = await getPool();
    const query = `INSERT INTO Proveedores (Nombre, Contacto, Telefono, Email) OUTPUT INSERTED.* VALUES (@nombre, @contacto, @telefono, @email)`;
    const result = await pool.request()
                    .input('nombre', sql.NVarChar(150), provedor.nombre)
                    .input('contacto', sql.NVarChar(100), provedor.contacto)
                    .input('telefono', sql.NVarChar(50), provedor.telefono ?? null)
                    .input('email', sql.NVarChar(100), provedor.email ?? null)
                    .query(query);
    return result.recordset[0];
};

export const actualizarProvedor = async(id: number, provedor: ActualizarProvedorDTO) => {
    const pool = await getPool();
    const query = `UPDATE Proveedores SET nombre = COALESCE(@nombre, nombre), contacto = COALESCE(@contacto, contacto), telefono = COALESCE(@telefono, telefono), email = COALESCE(@email, email) OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool.request()
                    .input('id', sql.Int, id)
                    .input('nombre', sql.NVarChar(150), provedor.nombre)
                    .input('contacto', sql.NVarChar(100), provedor.contacto)
                    .input('telefono', sql.NVarChar(50), provedor.telefono ?? null)
                    .input('email', sql.NVarChar(100), provedor.email ?? null)
                    .query(query);
    return result.recordset[0] ?? null;
};

export const eliminarProvedor = async(id: number) => {
    const pool = await getPool();
    const query = `UPDATE Proveedores SET Activo = 0 OUTPUT INSERTED.* WHERE id = @id`;
    const result = await pool.request().input('id', sql.Int, id).query(query);
    return result.recordset[0] ?? null;
};