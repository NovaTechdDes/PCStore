import { AjustarStockDTO, CrearMovimientosDTO, FiltrosMovimientosDTO } from "./movimientos.schema";
import { getPool, sql } from "../../config/db";

export const crearMovimientos = async (data: CrearMovimientosDTO, usuarioId: number) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        
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
            OUTPUT INSERTED.*
            VALUES(@productoId, @usuarioId, @cantidad, @tipo, @numeroFactura, @tipoVenta, @cliente)`
        );

        const movimiento = movResult.recordset[0];

        for(const numeroSerie of data.series){
            await new sql.Request(transaction)
            .input('movimientoId', sql.Int, movimiento.id)
            .input('productoId', sql.Int, data.productoId)
            .input('numeroSerie', sql.NVarChar(100), numeroSerie)
            .query(
                `INSERT INTO Series(MovimientoId, ProductoId, NumeroSerie)
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
};

export const listarMovimientos = async(filtros: FiltrosMovimientosDTO) => {
    const pool = await getPool();
    const request = pool.request();
    const condiciones: string[] = [];
    

    if(filtros.productoId){
        request.input('productoId', sql.Int, filtros.productoId)
        condiciones.push("m.ProductoId = @productoId")   
    };

    if(filtros.tipo){
        request.input('tipo', sql.NVarChar(20), filtros.tipo);
        condiciones.push('m.Tipo = @tipo')
    };

    if(filtros.desde){
        request.input('desde', sql.DateTime, filtros.desde);
        condiciones.push("m.Fecha >= @desde")
    }

    if(filtros.hasta){
        request.input('hasta', sql.DateTime, filtros.hasta);
        condiciones.push("m.Fecha <= @hasta")
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : ""
    
    const result = await request.query(`
        SELECT m.*, p.Descripcion AS ProductoDescripcion, p.CodigoInterno, u.NombreUsuario
        FROM Movimientos m    
        JOIN Productos p ON p.Id = m.ProductoId
        JOIN Usuarios u ON u.Id = m.UsuarioId
        ${where}
        ORDER BY m.Fecha DESC, m.Id DESC
    `) 
    return result.recordset;

};

export const obtenerMovimientoPorId = async(id: number) => {
    const pool = await getPool();

    const movResult = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`
        SELECT m.*, p.Descripcion AS ProductoDescripcion, p.CodigoInterno, u.NombreUsuario
        FROM Movimientos m
        JOIN Productos p ON p.Id = m.ProductoId
        JOIN Usuarios u ON u.Id = m.UsuarioId
        WHERE m.Id = @Id
    `);

    const movimiento = movResult.recordset[0];
    if(!movimiento) return null

    const seriesResult = await pool
    .request()
    .input('movimientoId', sql.Int, id)
    .query(`SELECT Id, NumeroSerie FROM Series WHERE MovimientoId = @movimientoId AND Activo = 1`);

    return {...movimiento, series: seriesResult.recordset};

};

export const ajustarStock = async (data: AjustarStockDTO, usuarioId: number) => {
    console.log(usuarioId)
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try{
        await transaction.begin();

        const productoResult = await new sql.Request(transaction)
        .input('id', sql.Int, data.productoId)
        .query(
            "SELECT * FROM Productos WITH (UPDLOCK, ROWLOCK) WHERE Id = @id and Activo = 1"
        );

        const producto = productoResult.recordset[0];
        
        if(!producto){
            throw { status: 404, msg: "Producto no encontrado"}
        };

        const stockCalculado = producto.Stock + data.cant;
        if(stockCalculado !== data.stock){
            throw {
                status: 409,
                msg: `El stock se cambio mientras editaba. Actual: ${producto.Stock}, recibido como final: ${data.stock}, calculado: ${stockCalculado}`
            }
        }

        const cantidadAbsoluta = Math.abs(data.cant);

        const movResult = await new sql.Request(transaction)
        .input('productoId', sql.Int, data.productoId)
        .input('tipo', sql.NVarChar(50), data.tipo)
        .input('cantidad', sql.Int, data.cant)
        .input("descripcion", sql.NVarChar(100), data.descripcion ?? null)
        .input('usuarioId', sql.Int, usuarioId)
        .query(`INSERT INTO Movimientos (ProductoId, Tipo, Cantidad, Referencia, UsuarioId)
            OUTPUT INSERTED.*
            VALUES (@productoId, @tipo, @cantidad, @descripcion, @usuarioId)    
        `);

        const movimiento = movResult.recordset[0];

        for (const {nro_serie, proveedorId, numeroFactura} of data.series) {
      await new sql.Request(transaction)
        .input("movimientoId", sql.Int, movimiento.Id)
        .input("productoId", sql.Int, producto.Id)
        .input("numeroSerie", sql.NVarChar(100), nro_serie)
        .input("numeroFactura", sql.NVarChar(50), numeroFactura)
        .input("provedorId", sql.Int, proveedorId)

        .query(`
          INSERT INTO Series (MovimientoId, ProductoId, NumeroSerie, NumeroFactura, ProveedorId)
          VALUES (@movimientoId, @productoId, @numeroSerie, @numeroFactura, @provedorId)
        `);
    }

    await new sql.Request(transaction)
      .input("id", sql.Int, producto.Id)
      .input("stock", sql.Int, data.stock)
      .query("UPDATE Productos SET Stock = @stock WHERE Id = @id");

    await transaction.commit();
        return obtenerMovimientoPorId(movimiento.Id);


    }catch(e){
        await transaction.rollback();
        throw e;
    }
    
}

