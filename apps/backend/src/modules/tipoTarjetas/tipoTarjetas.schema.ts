import { z } from "zod";

export const crearTipoTarjetaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim(),
  activo: z.boolean().optional().default(true),
});

export const actualizarTipoTarjetaSchema = crearTipoTarjetaSchema.partial();

export type CrearTipoTarjetaDTO = z.infer<typeof crearTipoTarjetaSchema>;
export type ActualizarTipoTarjetaDTO = z.infer<typeof actualizarTipoTarjetaSchema>;
