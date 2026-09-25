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
.refine((data) => data.cantidad > 0, {
    message: 'La cantidad debe ser mayor a 0',
    path: ['cantidad']
});

export const ajustarStockSchema = z.object({
    productoId: z.coerce.number().int().positive('Codigo Requerido'),
    stock: z.coerce.number(),
    tipo: tipoMovimientoEnum,
    vendedor: z.coerce.number().int().positive().optional(),
    cant: z.coerce.number(),
    descripcion: z.string().optional(),
    series: z.array(
        z.object({
             nro_serie: z.string().max(100).optional().nullable().transform(val => val?.trim() || null),
            proveedorId: z.coerce.number().int().optional().nullable(),
            numeroFactura: z.string().max(50).optional().nullable()
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