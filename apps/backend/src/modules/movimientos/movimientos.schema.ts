import { z } from "zod";

export const tipoMovimientoEnum = z.enum(["Entrada", "Salida", "Ajuste"]);

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
.refine((data) => data.tipo === 'Ajuste' || data.cantidad > 0, {
    message: 'La cantidad debe ser mayor a 0 para Entradas y Salidas',
    path: ['cantidad']
})
.refine((data) => data.tipo !== 'Ajuste' || data.cantidad !== 0, {
    message: 'La cantidad de ajuste no puede ser 0',
    path: ['cantidad']
});

export const filtrosMovimientosSchema = z.object({
    productoId: z.coerce.number().int().positive().optional(),
    tipo: tipoMovimientoEnum.optional(),
    desde: z.string().optional(),
    hasta: z.string().optional()
});

export type CrearMovimientosDTO = z.infer<typeof crearMovimientosSchema>;
export type FiltrosMovimientosDTO = z.infer<typeof filtrosMovimientosSchema>;