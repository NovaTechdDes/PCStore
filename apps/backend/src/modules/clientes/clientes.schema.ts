import { z } from "zod";

export const crearClienteSchema = z.object({
    nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
    cuit: z.string().max(20, "Debe tener como máximo 20 caracteres").optional(),
    condicionIva: z.string().max(50, "Debe tener como máximo 50 caracteres").default('Consumidor Final'),
    condicionFacturacion: z.number().int().positive().optional(),
    localidad: z.string().max(100, "Debe tener como máximo 100 caracteres").optional(),
    direccion: z.string().max(200, "Debe tener como máximo 200 caracteres").optional(),
    telefono: z.string().max(50, "Debe tener como máximo 50 caracteres").optional(),
    email: z.string().optional(),
    observaciones: z.string().max(255, "Debe tener como máximo 255 caracteres").optional().optional(),
});

export const actualizarClienteSchema = crearClienteSchema.partial();

export const filtrosClientesSchema = z.object({
    todos: z.string().optional(),
    buscar: z.string().optional()
})

export type CrearClienteDTO = z.infer<typeof crearClienteSchema>;
export type ActualizarClienteDTO = z.infer<typeof actualizarClienteSchema>;
export type FiltrosClientesDTO = z.infer<typeof filtrosClientesSchema>;