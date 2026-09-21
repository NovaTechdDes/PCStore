import { getPool, sql } from "../../config/db";
import {
  ActualizarTipoTarjetaDTO,
  CrearTipoTarjetaDTO,
} from "./tipoTarjetas.schema";

export const listarTiposTarjeta = async (soloActivas = true) => {
  const pool = await getPool();
  const query = soloActivas
    ? `SELECT * FROM TipoTarjetas WHERE Activo = 1 ORDER BY Nombre ASC`
    : `SELECT * FROM TipoTarjetas ORDER BY Nombre ASC`;

  const result = await pool.request().query(query);
  return result.recordset;
};

export const obtenerTipoTarjetaPorId = async (id: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM TipoTarjetas WHERE Id = @id");

  return result.recordset[0] ?? null;
};

export const crearTipoTarjeta = async (data: CrearTipoTarjetaDTO) => {
  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const existe = await new sql.Request(transaction)
      .input("nombre", sql.NVarChar(50), data.nombre)
      .query("SELECT Id FROM TipoTarjetas WHERE UPPER(Nombre) = UPPER(@nombre)");

    if (existe.recordset.length > 0) {
      throw {
        status: 409,
        msg: "Ya existe un tipo de tarjeta con ese nombre",
      };
    }

    const result = await new sql.Request(transaction)
      .input("nombre", sql.NVarChar(50), data.nombre)
      .input("activo", sql.Bit, data.activo ?? 1)
      .query(`
        INSERT INTO TipoTarjetas (Nombre, Activo)
        OUTPUT INSERTED.*
        VALUES (@nombre, @activo);
      `);

    await transaction.commit();
    return result.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const actualizarTipoTarjeta = async (
  id: number,
  data: ActualizarTipoTarjetaDTO
) => {
  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const itemExistente = await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("SELECT Id FROM TipoTarjetas WHERE Id = @id");

    if (itemExistente.recordset.length === 0) {
      throw {
        status: 404,
        msg: "Tipo de tarjeta no encontrado",
      };
    }

    if (data.nombre) {
      const duplicado = await new sql.Request(transaction)
        .input("id", sql.Int, id)
        .input("nombre", sql.NVarChar(50), data.nombre)
        .query(
          "SELECT Id FROM TipoTarjetas WHERE UPPER(Nombre) = UPPER(@nombre) AND Id <> @id"
        );

      if (duplicado.recordset.length > 0) {
        throw {
          status: 409,
          msg: "Ya existe otro tipo de tarjeta con ese nombre",
        };
      }
    }

    const result = await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar(50), data.nombre ?? null)
      .input("activo", sql.Bit, data.activo ?? null)
      .query(`
        UPDATE TipoTarjetas
        SET
          Nombre = COALESCE(@nombre, Nombre),
          Activo = COALESCE(@activo, Activo)
        OUTPUT INSERTED.*
        WHERE Id = @id;
      `);

    await transaction.commit();
    return result.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const eliminarTipoTarjeta = async (id: number) => {
  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    const result = await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("UPDATE TipoTarjetas SET Activo = 0 OUTPUT INSERTED.* WHERE Id = @id");

    if (!result.recordset[0]) {
      throw {
        status: 404,
        msg: "Tipo de tarjeta no encontrado",
      };
    }

    await transaction.commit();
    return result.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
