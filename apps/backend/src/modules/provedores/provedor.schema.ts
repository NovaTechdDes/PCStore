import { z } from "zod";

export const crearProveedorSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    contacto: z.string().min(1, 'El contacto es requerido').max(100),
    telefono: z.string().default('').optional().nullable(),
    email: z.email().default('').optional().nullable(),
})

export const actualizarProveedorSchema = crearProveedorSchema.partial();

export type CrearProveedorDTO = z.infer<typeof crearProveedorSchema>;
export type ActualizarProveedorDTO = z.infer<typeof actualizarProveedorSchema>;