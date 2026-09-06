import { z } from "zod";

export const rolEnum = z.enum(["admin", "vendedor"]);

export const crearUsuarioSchema = z.object({
  nombreUsuario: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(3, "La contraseña debe tener al menos 3 caracteres"),
  rol: rolEnum.default("vendedor"),
});

export const actualizarUsuarioSchema = z.object({
  nombreUsuario: z
    .string()
    .min(2, "El nombre de usuario debe tener al menos 3 caracteres")
    .optional(),
  rol: rolEnum.default("vendedor").optional(),
});

export const cambiarPasswordSchema = z.object({
  passwordActual: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  passwordNueva: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
  nombreUsuario: z.string().optional(),
});

export type CrearUsuarioDTO = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioDTO = z.infer<typeof actualizarUsuarioSchema>;
export type CambiarPasswordDTO = z.infer<typeof cambiarPasswordSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
