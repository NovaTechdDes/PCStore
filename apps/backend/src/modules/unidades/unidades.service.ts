import { getPool, sql } from "../../config/db";
import { ActualizarUnidadDTO, CrearUnidadDTO } from "./unidades.schema";

export const listarUnidades = async () => {
  const pool = await getPool();
  const query = "SELECT Id, Nombre FROM UnidadesMedida ORDER BY Nombre";
  const result = await pool.request().query(query);
  return result.recordset;
};

export const obtenerUnidadPorId = async (id: number) => {
  const pool = await getPool();
  const query = "SELECT Id, Nombre FROM UnidadesMedida WHERE Id = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};

export const crearUnidad = async (unidad: CrearUnidadDTO) => {
  const pool = await getPool();
  const query = "INSERT INTO UnidadesMedida (Nombre) OUTPUT INSERTED.* VALUES (@nombre)";
  const result = await pool
    .request()
    .input("nombre", sql.NVarChar(100), unidad.nombre)
    .query(query);
  return result.recordset[0];
};

export const actualizarUnidad = async (id: number, unidad: ActualizarUnidadDTO) => {
  const pool = await getPool();
  const query =
    "UPDATE UnidadesMedida SET Nombre = COALESCE(@nombre, Nombre) OUTPUT INSERTED.* WHERE Id = @id";
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombre", sql.NVarChar(100), unidad.nombre)
    .query(query);
  return result.recordset[0] ?? null;
};

export const eliminarUnidad = async (id: number) => {
  const pool = await getPool();

  const productosAsociados = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT TOP 1 Id FROM Productos WHERE UnidadId = @id");

  if (productosAsociados.recordset.length > 0) {
    throw {
      status: 400,
      msg: "No se puede eliminar la unidad de medida porque tiene productos asociados",
    };
  }

  const query = "DELETE FROM UnidadesMedida OUTPUT DELETED.* WHERE Id = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};
