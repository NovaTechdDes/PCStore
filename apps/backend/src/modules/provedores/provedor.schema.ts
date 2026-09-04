import { z } from "zod";

export const crearProvedorSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    contacto: z.string().min(1, 'El contacto es requerido').max(100),
    telefono: z.string().default('').optional().nullable(),
    email: z.email().default('').optional().nullable(),
})

export const actualizarProvedorSchema = crearProvedorSchema.partial();

export type CrearProvedorDTO = z.infer<typeof crearProvedorSchema>;
export type ActualizarProvedorDTO = z.infer<typeof actualizarProvedorSchema>;