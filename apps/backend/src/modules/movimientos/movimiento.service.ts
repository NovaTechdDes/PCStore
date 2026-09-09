import { CrearMovimientosDTO } from "./movimientos.schema";
import { getPool, sql } from "../../config/db";

export const crearMovimientos = async (data: CrearMovimientosDTO, usuarioId: number) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        const productoResult = await new sql.Request(transaction)
        .input('id', sql.Int, data.productoId)
        .query(
            `SELECT * FROM Productos WITH (UPDLOCK, ROWLOCK) WHERE Id = @id and Activo = 1`
        );

        const producto = productoResult.recordset[0];
        if(!producto){
            throw { status: 400, msg: "Producto no encontrado"}
        };

        

        const nuevoStock = producto.Stock + data.cantidad;

        const movResult = await new sql.Request(transaction)
        .input('productoId', sql.Int, data.productoId)
        .input('tipo', sql.NVarChar(50), data.tipo)
        .input('cantidad', sql.Int, data.cantidad)
        .input('referencia', sql.NVarChar(100), data.referencia ?? null)
        .input('usuarioId', sql.Int, usuarioId)
        .input('numeroFactura', sql.NVarChar(50), data.numeroFactura ?? null)
        .input('tipoVenta', sql.NVarChar(30), data.tipoVenta ?? null)
        .input('cliente', sql.NVarChar(150), data.cliente ?? null)
        .query(
            `INSERT INTO Movimientos(ProductoId, UsuarioId, Cantidad, Tipo, NumeroFactura, TipoVenta, Cliente)
            VALUES(@productoId, @usuarioId, @cantidad, @tipo, @numeroFactura, @tipoVenta, @cliente)`
        );

        const movimiento = movResult.recordset[0];

        for(const numeroSerie of data.series){
            await new sql.Request(transaction)
            .input('movimientoId', sql.Int, movimiento.id)
            .input('productoId', sql.Int, data.productoId)
            .input('numeroSerie', sql.NVarChar(100), numeroSerie)
            .query(
                `INSERT INTO MovimientosSeries(MovimientoId, ProductoId, NumeroSerie)
                VALUES(@movimientoId, @productoId, @numeroSerie)`
            );
        }

        await new sql.Request(transaction)
        .input('productoId', sql.Int, data.productoId)
        .input('stock', sql.Int, nuevoStock)
        .query(
            `UPDATE Productos SET Stock = @stock WHERE Id = @productoId`
        );

        await transaction.commit();
        return obtenerMovimientoPorId(movimiento.Id); 

    } catch (error: any) {
        await transaction.rollback();
        console.error(error)
        if (error.number === 2627 || error.number === 2601) {
      throw {
        status: 409,
        msg: "Uno de los números de serie ya existe para este producto",
      };
    }
        throw error;
    }
}