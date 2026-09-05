import { getPool, sql } from "../../config/db";

export const obtenerValorClave = async (clave: string): Promise<number> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("clave", sql.NVarChar(50), clave)
    .query("SELECT Valor FROM Configuracion WHERE Clave = @clave");

  if (result.recordset.length === 0) {
    throw { status: 404, msg: `No existe configuración para la clave '${clave}'` };
  }

  return Number(result.recordset[0].Valor);
};

export const listarConfiguracion = async () => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Configuracion ORDER BY Clave");
  return result.recordset;
};

export const obtenerConfiguracionPorClave = async (clave: string) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("clave", sql.NVarChar(50), clave)
    .query("SELECT * FROM Configuracion WHERE Clave = @clave");

  return result.recordset[0] ?? null;
};

export const actualizarValorClave = async (clave: string, valor: number) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("clave", sql.NVarChar(50), clave)
    .input("valor", sql.Decimal(18, 2), valor)
    .query(`
      UPDATE Configuracion
      SET Valor = @valor, FechaActualizacion = GETDATE()
      OUTPUT INSERTED.*
      WHERE Clave = @clave
    `);

  if (result.recordset.length === 0) {
    throw { status: 404, msg: `No existe configuración para la clave '${clave}'` };
  }

  return result.recordset[0];
};

export const obtenerValorDolar = async () => {
  const config = await obtenerConfiguracionPorClave("ValorDolar");
  if (!config) {
    throw { status: 404, msg: "No se encontró la configuración para 'ValorDolar'" };
  }
  return config;
};

export const actualizarValorDolar = async (valor: number, recalcularPrecios: boolean = true) => {
  const pool = await getPool();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    // 1. Actualizar el valor en la tabla Configuracion
    const updateResult = await new sql.Request(transaction)
      .input("valor", sql.Decimal(18, 2), valor)
      .query(`
        UPDATE Configuracion
        SET Valor = @valor, FechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE Clave = 'ValorDolar'
      `);

    if (updateResult.recordset.length === 0) {
      throw { status: 404, msg: "No se encontró la clave 'ValorDolar' en la configuración" };
    }

    let productosAfectados = 0;

    // 2. Si se solicita, recalcular el precio de todos los productos cotizados en dólares
    if (recalcularPrecios) {
      const recalcResult = await new sql.Request(transaction)
        .input("valorDolar", sql.Decimal(18, 2), valor)
        .query(`
          UPDATE Productos
          SET Precio = ROUND((CostoDolar * @valorDolar * (1 + IVA / 100)) * (1 + Ganancia / 100), 2)
          WHERE CostoDolar > 0 AND Activo = 1
        `);

      productosAfectados = recalcResult.rowsAffected[0] ?? 0;
    }

    await transaction.commit();

    return {
      configuracion: updateResult.recordset[0],
      productosAfectados,
      recalculoAplicado: recalcularPrecios,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
