import { z } from "zod";

export const tipoMovimientoEnum = z.enum(["Entrada", "Salida", "Suma", 'Resta']);

export const crearMovimientosSchema = z.object({
    productoId: z.coerce.number().int().positive(),
    tipo: tipoMovimientoEnum,
    cantidad: z.coerce.number().int().positive(),
    referencia: z.string().max(100).optional(),
    numeroFactura: z.string().max(50).optional(),
    tipoVenta: z.string().max(30).optional(),
    cliente: z.string().max(150).optional(),
    series: z.array(z.string().min(1).max(100)).optional().default([]),
})
.refine((data) => data.tipo === 'Suma' || data.cantidad > 0, {
    message: 'La cantidad debe ser mayor a 0 para Suma',
    path: ['cantidad']
})
.refine((data) => data.tipo === 'Resta' || data.cantidad < 0, {
    message: 'La cantidad debe ser mayor a 0 para Resta',
    path: ['cantidad']
})
.refine((data) => (data.tipo !== 'Suma' && data.tipo !== 'Resta') || data.cantidad !== 0, {
    message: 'La cantidad de ajuste no puede ser 0',
    path: ['cantidad']
});

export const ajustarStockSchema = z.object({
    productoId: z.number().min(1, 'Codigo Requerido'),
    stock: z.number(),
    tipo: tipoMovimientoEnum,
    vendedor: z.coerce.number().int().positive().optional(),
    cant: z.number(),
    descripcion: z.string().optional(),
    series: z.array(
        z.object({
            nro_serie: z.string().min(1).max(100),
            proveedorId: z.coerce.number().int(),
            numeroFactura: z.string().max(50)
        })
    ).optional().default([])
})
.refine((data) => data.cant !== 0, {
    message: "La cantidad no puede ser 0",
    path: ['cant']
});

export const filtrosMovimientosSchema = z.object({
    productoId: z.coerce.number().int().positive().optional(),
    tipo: tipoMovimientoEnum.optional(),
    desde: z.string().optional(),
    hasta: z.string().optional()
});

export type CrearMovimientosDTO = z.infer<typeof crearMovimientosSchema>;
export type FiltrosMovimientosDTO = z.infer<typeof filtrosMovimientosSchema>;
export type AjustarStockDTO = z.infer<typeof ajustarStockSchema>;