import z from "zod";

export const productoItemSchema = z.object({
    id: z.number(),
    cantidad: z.number(),
    precio: z.number(),
    descripcion: z.string().optional(),
    impuesto: z.number().optional(),
    marca: z.string().optional(),
    series: z.union([z.array(z.string()), z.string()]).optional(),
    productoOriginal: z.any().optional(),
})

export const createPresupuestoSchema = z.object({
    presupuesto: z.object({
        clienteId: z.coerce.number().int().positive().optional(),
        clienteNombre: z.string().min(1).max(100).optional(),
        clienteTelefono: z.string().max(50).optional(),
        clienteDomicilio: z.string().max(255).optional(),

        facturado: z.boolean().default(false),
        formaPago: z.string(),
        tipoComprobante: z.string(),
        numeroComprobante: z.string().optional(),
        fecha: z.string(),
        total: z.number(),
        activo: z.boolean().default(true),
    }),
    productos: z.array(productoItemSchema)
});

export const filtrosPresupuestoSchema = z.object({
    fecha: z.coerce.date(),
    clienteId: z.coerce.number().int().positive().optional(),
});

export type ProductoItem = z.infer<typeof productoItemSchema>;
export type CreatePresupuestoDTO = z.infer<typeof createPresupuestoSchema>;
export type FiltrosPresupuestoDTO = z.infer<typeof filtrosPresupuestoSchema>;