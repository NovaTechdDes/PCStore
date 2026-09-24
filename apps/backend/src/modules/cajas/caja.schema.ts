import z from "zod";

export const filtrosCajaSchema = z.object({
    desde: z.string().min(1, 'La fecha "desde" es requerida'),
    hasta: z.string().min(1, 'La fecha "hasta" es requerida')
});

export type filtrosCajaSchema = z.infer<typeof filtrosCajaSchema>;