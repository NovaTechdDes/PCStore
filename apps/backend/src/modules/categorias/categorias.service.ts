import { getPool, sql } from "../../config/db";
import { ActualizarCategoriaDTO, CrearCategoriaDTO } from "./categorias.schema";

export const listarCategorias = async () => {
  const pool = await getPool();
  const query = "SELECT Id_categoria, Nombre FROM Categoria ORDER BY Nombre";
  const result = await pool.request().query(query);
  return result.recordset;
};

export const obtenerCategoriaPorId = async (id: number) => {
  const pool = await getPool();
  const query = "SELECT Id_categoria, Nombre FROM Categoria WHERE Id_categoria = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};

export const crearCategoria = async (categoria: CrearCategoriaDTO) => {
  const pool = await getPool();
  const query = "INSERT INTO Categoria (Nombre) OUTPUT INSERTED.* VALUES (@nombre)";
  const result = await pool
    .request()
    .input("nombre", sql.VarChar(100), categoria.nombre)
    .query(query);
  return result.recordset[0];
};

export const actualizarCategoria = async (id: number, categoria: ActualizarCategoriaDTO) => {
  const pool = await getPool();
  const query =
    "UPDATE Categoria SET Nombre = COALESCE(@nombre, Nombre) OUTPUT INSERTED.* WHERE Id_categoria = @id";
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombre", sql.VarChar(100), categoria.nombre)
    .query(query);
  return result.recordset[0] ?? null;
};

export const eliminarCategoria = async (id: number) => {
  const pool = await getPool();

  // Verificar si hay productos asociados a esta categoría
  const productosAsociados = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT TOP 1 Id FROM Productos WHERE Id_categoria = @id");

  if (productosAsociados.recordset.length > 0) {
    throw {
      status: 400,
      msg: "No se puede eliminar la categoría porque tiene productos asociados",
    };
  }

  const query = "DELETE FROM Categoria OUTPUT DELETED.* WHERE Id_categoria = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};
