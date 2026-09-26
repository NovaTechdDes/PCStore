import { config } from "dotenv";
import { getPool, sql } from "../../config/db";
import { CreatePresupuestoDTO } from "./presupuesto.schema";

export const createPresupuesto = async (data: CreatePresupuestoDTO, usuarioId: number) => {
    if(!usuarioId) return null;

    const pool = await getPool();
    const transaction = pool.transaction();


    try {
        await transaction.begin();
        const configResult = await new sql.Request(transaction)
            .input('clave', sql.NVarChar(50), 'ValorDolar')
            .query(`
                SELECT Valor FROM Configuracion WHERE Clave = @clave
            `);

        if(configResult.recordset.length === 0) {
            throw { status: 400, msg: "No se enctro el valor del dolar"}
        };

        const valorDolar = configResult.recordset[0].Valor;

        const presupuestoResult = await new sql.Request(transaction)
            .input('fecha', sql.NVarChar(50), data.presupuesto.fecha)
            .input('total', sql.Decimal(18,2), data.presupuesto.total)
            .input('activo', sql.Bit, data.presupuesto.activo)
            .input('clienteId', sql.Int, data.presupuesto.clienteId)
            .input('usuarioId', sql.Int, usuarioId)
            .input('tipoComprobante', sql.NVarChar(50), data.presupuesto.tipoComprobante)
            .input('numeroComprobante', sql.NVarChar(50), data.presupuesto.numeroComprobante)
            .input('clienteNombre', sql.NVarChar(150), data.presupuesto.clienteNombre)
            .input('clienteTelefono', sql.NVarChar(50), data.presupuesto.clienteTelefono)
            .input('clienteDomicilio', sql.NVarChar(200), data.presupuesto.clienteDomicilio)
            .input('dolar', sql.Decimal(18,4), valorDolar)
            .query(`
                INSERT INTO Presupuestos (Fecha, Total, Activo, ClienteId, UsuarioId, TipoComprobante, NumeroComprobante, ClienteNombre, ClienteTelefono, ClienteDomicilio, Dolar)
                OUTPUT inserted.*
                VALUES (@fecha, @total, @activo, @clienteId, @usuarioId, @tipoComprobante, @numeroComprobante, @clienteNombre, @clienteTelefono, @clienteDomicilio, @dolar)
            `);
        
        const presupuesto = presupuestoResult.recordset[0]; 
        const presupuestoId = presupuestoResult.recordset[0].Id;

        // 2. Procesar Cada Producto

        for(const prod of data.productos){
            // A. Registrar en PresupuestoDetalle
            await new sql.Request(transaction)
                  .input('presupuestoId', sql.Int, presupuestoId)
                  .input('productoId', sql.Int, prod.id)
                  .input('cantidad',sql.Int, prod.cantidad)
                  .input('precio',sql.Money, prod.precio)
                  .query(`
                        INSERT INTO PresupuestoDetalle (PresupuestoId, ProductoId, Cantidad, PrecioUnitario)
                        VALUES (@presupuestoId, @productoId, @cantidad, @precio)
                    `)
        }
        await transaction.commit();
        return presupuesto
        
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}