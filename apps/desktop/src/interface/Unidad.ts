export interface UnidadMedida {
  Id: number;
  Nombre: string;
}

export interface CrearUnidadDTO {
  nombre: string;
}

export interface ActualizarUnidadDTO {
  nombre?: string;
}
