import { getPool, sql } from "../../config/db";
import { filtrosCajaSchema } from "./caja.schema";

export const obtenerCajaPorFecha = async(filtros: filtrosCajaSchema) => {
    const pool = await getPool();
    const request = pool.request();


    const fechaDesde = filtros.desde.includes('T') || filtros.desde.includes(" ") ? filtros.desde : `${filtros.desde} 00:00:00`;
    const fechaHasta = filtros.hasta.includes('T') || filtros.hasta.includes(" ") ? filtros.hasta : `${filtros.hasta} 23:59:59`;

    request.input('desde', sql.DateTime, fechaDesde);
    request.input('hasta', sql.DateTime, fechaHasta);
    

    // 1. Obtener el listado de ventas en ese rango
    const ventasResult = await request.query(`
        SELECT v.Id, v.Fecha, V.Total, V.FormaPago, v.TipoComprobante, v.NumeroComprobante, v.ClienteNombre, v.ClienteTelefono, v.ClienteDomicilio, v.Activo, v.UsuarioId, u.NombreUsuario
        FROM ventas v
        INNER JOIN Usuarios u ON u.Id = v.UsuarioId
        WHERE v.Activo = 1
        AND v.Fecha >= @desde
        AND v.Fecha <= @hasta
        ORDER BY v.Fecha DESC, v.Id DESC;
    `);

    // 2. Resumen Total Por meotods de pago
    const requestTotales = pool.request();
    requestTotales.input('desde', sql.DateTime, fechaDesde);
    requestTotales.input('hasta', sql.DateTime, fechaHasta);

    const totalesResult = await requestTotales.query(`
        SELECT ISNULL(mp.Tipo, 'Sin Especificar') AS TipoPago,
            SUM(mp.Monto)  AS Total
        FROM MetodosPago mp
        WHERE mp.Activo = 1
            AND mp.Fecha >= @desde
            AND mp.Fecha <= @hasta
        GROUP BY mp.Tipo
    `)

    const  totalGeneral = ventasResult.recordset.reduce((acc, v) => acc + Number(v.Total || 0), 0);

    return {
        periodo: {
            desde: fechaDesde,
            hasta: fechaHasta,
        },
        resumen: {
            cantidadVentas: ventasResult.recordset.length,
            totalGeneral,
            metodosPago: totalesResult.recordset
        },
        ventas: ventasResult.recordset
    };
}