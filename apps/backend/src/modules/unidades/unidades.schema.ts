import { z } from "zod";

export const crearUnidadSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
});

export const actualizarUnidadSchema = crearUnidadSchema.partial();

export type CrearUnidadDTO = z.infer<typeof crearUnidadSchema>;
export type ActualizarUnidadDTO = z.infer<typeof actualizarUnidadSchema>;
