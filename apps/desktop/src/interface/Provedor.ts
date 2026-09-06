export interface Provedor {
  Id: number;
  Nombre: string;
  Contacto: string;
  Telefono?: string | null;
  Email?: string | null;
}

export interface CrearProvedorDTO {
  nombre: string;
  contacto: string;
  telefono?: string | null;
  email?: string | null;
}

export interface ActualizarProvedorDTO {
  nombre?: string;
  contacto?: string;
  telefono?: string | null;
  email?: string | null;
}
