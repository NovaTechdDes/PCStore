import { z } from 'zod';

export const crearMarcaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    activo: z.boolean().optional().default(true),
    sitioWeb: z.string().optional(),
    descripcion: z.string().optional(),
});

export const actualizarSchema = crearMarcaSchema.partial();

export type CrearMarcaDTO = z.infer<typeof crearMarcaSchema>
export type ActualizarMarcaDTO = z.infer<typeof actualizarSchema>