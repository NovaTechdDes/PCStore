import { z } from "zod";

export const actualizarValorDolarSchema = z.object({
  valor: z.coerce.number().positive("El valor del dólar debe ser mayor a 0"),
  recalcularPrecios: z.boolean().optional().default(true),
});

export const actualizarConfiguracionSchema = z.object({
  valor: z.coerce.number().min(0, "El valor no puede ser negativo"),
});

export type ActualizarValorDolarDTO = z.infer<typeof actualizarValorDolarSchema>;
export type ActualizarConfiguracionDTO = z.infer<typeof actualizarConfiguracionSchema>;
