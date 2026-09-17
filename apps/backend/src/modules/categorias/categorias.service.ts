import { getPool, sql } from "../../config/db";
import { ActualizarCategoriaDTO, CrearCategoriaDTO } from "./categorias.schema";

export const listarCategorias = async () => {
  const pool = await getPool();
  const query = "SELECT c.Id, c.Nombre, c.Descripcion, c.Activo, (SELECT COUNT(1) FROM Productos p WHERE p.CategoriaId = c.Id) as TotalProductos FROM Categorias c WHERE c.Activo = 1 ORDER BY c.Nombre";
  const result = await pool.request().query(query);
  return result.recordset;
};

export const obtenerCategoriaPorId = async (id: number) => {
  const pool = await getPool();
  const query = "SELECT Id, Nombre, Descripcion, Activo FROM Categorias WHERE Id = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};

export const crearCategoria = async (categoria: CrearCategoriaDTO) => {
  const pool = await getPool();
  const query = "INSERT INTO Categorias (Nombre, Descripcion, Activo) OUTPUT INSERTED.* VALUES (@nombre, @descripcion, @activo)";
  const result = await pool
    .request()
    .input("nombre", sql.VarChar(100), categoria.nombre)
    .input("descripcion", sql.VarChar(100), categoria.descripcion)
    .input("activo", sql.Bit, categoria.activo)
    .query(query);
  return result.recordset[0];
};

export const actualizarCategoria = async (id: number, categoria: ActualizarCategoriaDTO) => {
  const pool = await getPool();
  const query =
    "UPDATE Categorias SET Nombre = COALESCE(@nombre, Nombre), Descripcion = COALESCE(@descripcion, Descripcion), Activo = COALESCE(@activo, Activo) OUTPUT INSERTED.* WHERE Id = @id";
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nombre", sql.VarChar(100), categoria.nombre)
    .input("descripcion", sql.VarChar(100), categoria.descripcion)
    .input("activo", sql.Bit, categoria.activo)
    .query(query);
  return result.recordset[0] ?? null;
};

export const eliminarCategoria = async (id: number) => {
  const pool = await getPool();

  // Verificar si hay productos asociados a esta categoría
  const productosAsociados = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT TOP 1 Id FROM Productos WHERE CategoriaId = @id");

  if (productosAsociados.recordset.length > 0) {
    throw {
      status: 400,
      msg: "No se puede eliminar la categoría porque tiene productos asociados",
    };
  }

  const query = "UPDATE Categorias SET Activo = 0 OUTPUT INSERTED.* WHERE Id = @id";
  const result = await pool.request().input("id", sql.Int, id).query(query);
  return result.recordset[0] ?? null;
};
