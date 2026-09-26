import { boolean } from "zod";
import { getPool, sql } from "../../config/db";
import { CreateVentaDTO } from "./ventas.schema";

export const createVenta = async (data: CreateVentaDTO, usuarioId: number) => {
    if(!usuarioId) return null;
    
    const pool = await getPool();
    const transaction = pool.transaction();

    try {
        await transaction.begin();

        // Traemos el valor del Dólar
        const configResult = await new sql.Request(transaction)
            .input('clave', sql.NVarChar(50), 'ValorDolar')
            .query(`
                SELECT Valor FROM Configuracion WHERE Clave = @clave
            `);

        if(configResult.recordset.length === 0) {
            throw { status: 400, msg: "No está configurado el valor del dólar." };
        }
        const valorDolar = configResult.recordset[0].Valor;

        console.log(valorDolar)

        const ventaResult = await new sql.Request(transaction)
        .input('fecha', sql.NVarChar(50), data.venta.fecha)
        .input('total', sql.Numeric, data.venta.total)
        .input('activo', sql.Bit, data.venta.activo)
        .input('clienteId', sql.Int, data.venta.clienteId)
        .input('usuarioId', sql.Int, usuarioId)
        .input('formaPago', sql.NVarChar(50), data.venta.formaPago)
        .input('tipoComprobante', sql.NVarChar(50), data.venta.tipoComprobante)
        .input('numeroComprobante', sql.NVarChar(50), data.venta.numeroComprobante)
        .input('clienteNombre', sql.NVarChar(100), data.venta.clienteNombre)
        .input('clienteTelefono', sql.NVarChar(20), data.venta.clienteTelefono)
        .input('clienteDomicilio', sql.NVarChar(50), data.venta.clienteDomicilio)
        .input('dolar', sql.Numeric(18,4), valorDolar)
        .query(`
            INSERT INTO Ventas (Fecha, Total, Activo, ClienteId, UsuarioId, ClienteNombre, ClienteTelefono, ClienteDomicilio, Dolar)
            OUTPUT INSERTED.*
            VALUES (@fecha, @total, @activo, @clienteId, @usuarioId, @clienteNombre, @clienteTelefono, @clienteDomicilio, @dolar)            
        `);

        const venta = ventaResult.recordset[0];
        const ventaId = venta.Id;

        // 2. Procesar Cada Producto
        for ( const prod of data.productos){

            // A. Registrar en VentaDetalle
            await new sql.Request(transaction)
                .input('ventaId', sql.Int, ventaId)
                .input('productoId', sql.Int, prod.id)
                .input('cantidad', sql.Int, prod.cantidad)
                .input('precio', sql.Money, prod.precio)
                .query(`
                    INSERT INTO VentaDetalle (VentaId, ProductoId, Cantidad, PrecioUnitario)
                    VALUES (@ventaId, @productoId, @cantidad, @precio)
                `);


            // B. Descontar Stock
            if(data.descontarStock) {
                const prodResult = await new sql.Request(transaction)
                .input('id', sql.Int, prod.id)
                .query(`
                    SELECT Id, Stock FROM Productos WITH (UPDLOCK, ROWLOCK)
                    WHERE Id = @id AND Activo = 1    
                `);
            
                const producto = prodResult.recordset[0];
                if(!producto){
                    throw { status: 404, msg: `Producto con ID ${prod.id} no existe`}
                }

                // Calculo de Stock
                const nuevoStock = producto.Stock - prod.cantidad;
                
                await new sql.Request(transaction)
                .input('id',sql.Int, prod.id)
                .input('stock',sql.Int, nuevoStock)
                .query(`
                    UPDATE Productos SET Stock = @stock WHERE Id = @id
                `)
            }

            //Ingresamos Movimientos
            const cantidadMov = -Math.abs(prod.cantidad);

            const mov = await new sql.Request(transaction)
                .input('productoId', sql.Int, prod.id)
                .input('tipo',sql.NVarChar, 'Salida')
                .input('cantidad', sql.Int, cantidadMov)
                .input('referencia', sql.NVarChar, `Venta #${ventaId}`)
                .input('usuarioId',sql.Int, usuarioId)
                .query(`
                    INSERT INTO Movimientos (ProductoId, Tipo, Cantidad, Referencia, UsuarioId)
                    OUTPUT INSERTED.Id
                    VALUES (@productoId, @tipo, @cantidad, @referencia, @usuarioId)    
                `)

                

            // Si tiene numeros de series, dar de baja
            if(prod.series){
                const seriesList: string[] = Array.isArray(prod.series) ? prod.series : typeof  prod.series === 'string' ? prod.series.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean) : [];

                for(const nroSerie of seriesList){
                    
                    const bajaResult = await new sql.Request(transaction)
                    .input('MovimientoId', sql.Int, mov.recordset[0].Id)
                    .input('ProductoId', sql.Int, prod.id)
                    .input('NumeroSerie', sql.NVarChar(50), nroSerie)
                    .input('NumeroFactura', sql.Int, ventaId)
                    .input('ProveedorId', sql.Int, null)
                    .query(`
                        INSERT INTO Series (MovimientoId, ProductoId, NumeroSerie, NumeroFactura, ProveedorId)  
                        OUTPUT INSERTED.Id
                        VALUES (@MovimientoId, @ProductoId, @NumeroSerie, @NumeroFactura, @ProveedorId)  
                    `)
                }
                
                
            }
        }

        // Cargamos metodo de pago
        if(data.metodosPagos && data.metodosPagos.length > 0) {
            for(const mp of data.metodosPagos){
                const nroComp = mp.numero;

                await new sql.Request(transaction)
                .input('fecha', sql.Date, data.venta.fecha)
                .input('monto', sql.Money, mp.monto)
                .input('tipo', sql.NVarChar(50), mp.tipo)
                .input('nroComp', sql.NVarChar(50), ventaId.toString()) 
                .input('comprobanteId', sql.Int, ventaId)
                .input('tipoComprobante', sql.NVarChar(50), data.venta.tipoComprobante)
                .query(`
                    INSERT INTO MetodosPago (Monto, Tipo, NroComp, ComprobanteId, TipoComprobante)
                    VALUES (@monto, @tipo, @nroComp, @comprobanteId, @tipoComprobante)
                `)
            }
        }
            
        await transaction.commit();
        return venta;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}