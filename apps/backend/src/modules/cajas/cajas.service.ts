import { getPool, sql } from "../../config/db";
import { filtrosCajaSchema } from "./caja.schema";

export const obtenerCajaPorFecha = async(filtros: filtrosCajaSchema) => {
    const pool = await getPool();
    const request = pool.request();

    const fechaDesde = filtros.desde.includes('T') || filtros.desde.includes(" ") ? filtros.desde : `${filtros.desde} 00:00:00`;
    const fechaHasta = filtros.hasta.includes('T') || filtros.hasta.includes(" ") ? filtros.hasta : `${filtros.hasta} 23:59:59`;
    const tipo = filtros.tipo;

    request.input('desde', sql.DateTime, fechaDesde);
    request.input('hasta', sql.DateTime, fechaHasta);

    let ventasResult: any;

    if (tipo === 'PP') {
        ventasResult = await request.query(`
            SELECT p.Id, p.Fecha, p.TipoComprobante, p.Total, p.ClienteNombre, p.ClienteTelefono, p.ClienteDomicilio, p.Activo, p.UsuarioId, u.NombreUsuario, p.Dolar
            FROM Presupuestos p
            INNER JOIN Usuarios u ON u.Id = p.UsuarioId
            WHERE p.Activo = 1
            AND p.Fecha >= @desde
            AND p.Fecha <= @hasta
            ORDER BY p.Fecha DESC, p.Id DESC;
        `);
    } else {
        ventasResult = await request.query(`
            SELECT v.Id, v.Fecha, v.Total, v.FormaPago, v.TipoComprobante, v.NumeroComprobante, v.ClienteNombre, v.ClienteTelefono, v.ClienteDomicilio, v.Activo, v.UsuarioId, u.NombreUsuario, v.Dolar
            FROM Ventas v
            INNER JOIN Usuarios u ON u.Id = v.UsuarioId
            WHERE v.Activo = 1
            AND v.Fecha >= @desde
            AND v.Fecha <= @hasta
            ORDER BY v.Fecha DESC, v.Id DESC;
        `);
    }

    // 2. Resumen Total Por metodos de pago
    const requestTotales = pool.request();
    requestTotales.input('desde', sql.DateTime, fechaDesde);
    requestTotales.input('hasta', sql.DateTime, fechaHasta);

    const totalesResult = await requestTotales.query(`
        SELECT ISNULL(mp.Tipo, 'Sin Especificar') AS TipoPago,
            SUM(mp.Monto) AS Total
        FROM MetodosPago mp
        WHERE mp.Activo = 1
            AND mp.Fecha >= @desde
            AND mp.Fecha <= @hasta
        GROUP BY mp.Tipo
    `);

    const totalGeneral = ventasResult.recordset.reduce((acc: number, v: any) => acc + Number(v.Total || 0), 0);

    const ventas = ventasResult.recordset;
    let ventasConDetalle = [];
    if (ventas.length > 0) {
        const ventasIds = ventas.map((v: any) => v.Id);

        let detallesResult: any;

        if (tipo === 'PP') {
            detallesResult = await pool.request().query(`
                SELECT 
                    pd.Id,
                    pd.PresupuestoId AS VentaId,
                    pd.ProductoId,
                    p.Descripcion,
                    p.Descripcion AS ProductoDescripcion,
                    p.CodigoInterno,
                    p.IVA AS Impuesto,
                    p.IVA,
                    m.Nombre AS MarcaNombre,
                    img.RutaArchivo AS Imagen,
                    pd.Cantidad,
                    pd.PrecioUnitario,
                    (pd.Cantidad * pd.PrecioUnitario) AS Subtotal
                FROM PresupuestoDetalle pd
                INNER JOIN Productos p ON p.Id = pd.ProductoId
                LEFT JOIN Marcas m ON m.Id = p.MarcaId
                OUTER APPLY (
                    SELECT TOP 1 pi.RutaArchivo
                    FROM ProductoImagenes pi
                    WHERE pi.ProductoId = p.Id
                    ORDER BY pi.EsPrincipal DESC, pi.Id ASC
                ) img
                WHERE pd.PresupuestoId IN (${ventasIds.join(',')})
                ORDER BY pd.Id ASC;
            `);
        } else {
            detallesResult = await pool.request().query(`
                SELECT 
                    vd.Id,
                    vd.VentaId,
                    vd.ProductoId,
                    p.Descripcion,
                    p.Descripcion AS ProductoDescripcion,
                    p.CodigoInterno,
                    p.IVA AS Impuesto,
                    p.IVA,
                    m.Nombre AS MarcaNombre,
                    img.RutaArchivo AS Imagen,
                    vd.Cantidad,
                    vd.PrecioUnitario,
                    (vd.Cantidad * vd.PrecioUnitario) AS Subtotal
                FROM VentaDetalle vd
                INNER JOIN Productos p ON p.Id = vd.ProductoId
                LEFT JOIN Marcas m ON m.Id = p.MarcaId
                OUTER APPLY (
                    SELECT TOP 1 pi.RutaArchivo
                    FROM ProductoImagenes pi
                    WHERE pi.ProductoId = p.Id
                    ORDER BY pi.EsPrincipal DESC, pi.Id ASC
                ) img
                WHERE vd.VentaId IN (${ventasIds.join(',')})
                ORDER BY vd.Id ASC;
            `);
        }

        // Agrupamos los detalles por ventaId
        const detallesMap = new Map<number, any[]>();
        for (const detalle of detallesResult.recordset) {
            if (!detallesMap.has(detalle.VentaId)) {
                detallesMap.set(detalle.VentaId, []);
            }
            detallesMap.get(detalle.VentaId)!.push(detalle);
        }

        // Unimos las ventas/presupuestos con sus detalles
        ventasConDetalle = ventas.map((v: any) => {
            return {
                ...v,
                detalles: detallesMap.get(v.Id) || []
            };
        });
    }

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
        ventas: ventasConDetalle
    };
}