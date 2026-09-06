export type RolUsuario = "admin" | "vendedor";

export interface Usuario {
  Id: number;
  NombreUsuario: string;
  Rol: RolUsuario;
  Activo?: boolean;
}

export interface CrearUsuarioDTO {
  nombreUsuario: string;
  password: string;
  rol?: RolUsuario;
}

export interface ActualizarUsuarioDTO {
  nombreUsuario?: string;
  rol?: RolUsuario;
}

export interface CambiarPasswordDTO {
  passwordActual: string;
  passwordNueva: string;
}

export interface LoginDTO {
  nombreUsuario?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
