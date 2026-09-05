import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
});

export const actualizarCategoriaSchema = crearCategoriaSchema.partial();

export type CrearCategoriaDTO = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoriaDTO = z.infer<typeof actualizarCategoriaSchema>;
