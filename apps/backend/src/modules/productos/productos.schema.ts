import { z } from 'zod';

export const caracteristicaSchema = z.object({
    clave: z.string().min(1).max(50),
    valor: z.string().min(1).max(150)
});

export const crearProductoSchema = z.object({
    codigoInterno: z.string().min(1, 'Requerido').max(50),
    codigoBarra: z.string().max(50).optional(),
    cod_fabrica: z.string().max(50).optional(),
    descripcion: z.string().min(1, 'Requerido').max(255),
    marcaId: z.coerce.number().int().positive().optional(),
    proveedorId: z.coerce.number().int().positive().optional(),
    unidadId: z.coerce.number().int().positive().optional(),
    Id_categoria: z.coerce.number().int().positive().optional(),
    costo: z.coerce.number().min(0).default(0),
    costoDolar: z.coerce.number().min(0).default(0),
    iva: z.coerce.number().min(0).default(0),
    ganancia: z.coerce.number().min(0).default(0),
    stock: z.coerce.number().min(0).default(0),
    caracteristicas: z.array(caracteristicaSchema).optional().default([]),
});

export const actualizarProductoSchema = z.object({
    codigoInterno: z.string().min(1).max(50).optional(),
    codigoBarra: z.string().max(50).optional(),
    cod_fabrica: z.string().max(50).optional(),
    descripcion: z.string().min(1).max(255).optional(),
    marcaId: z.coerce.number().int().positive().optional(),
    proveedorId: z.coerce.number().int().positive().optional(),
    unidadId: z.coerce.number().int().positive().optional(),
    Id_categoria: z.coerce.number().int().positive().optional(),
    costo: z.coerce.number().min(0).optional(),
    costoDolar: z.coerce.number().min(0).optional(),
    iva: z.coerce.number().min(0).optional(),
    ganancia: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(0).optional(),
});

export const actualizarStockSchema = z.object({
    productoId: z.coerce.number().int().positive(),
    stock: z.coerce.number().min(0),
    tipo: z.string().min(1).max(50),
    descripcion: z.string().min(1).max(255),
    vendedor: z.coerce.number().int().positive(),
    cant: z.coerce.number().int().positive(),
})

export const filtrosProductoSchema = z.object({
    todos: z.string().optional(),
    marcaId: z.coerce.number().int().positive().optional(),
    proveedorId: z.coerce.number().int().positive().optional(),
    buscar: z.string().optional()
});

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>;
export type ActualizarStockDTO = z.infer<typeof actualizarStockSchema>;
export type FiltrosProductoDTO = z.infer<typeof filtrosProductoSchema>;