export interface Marca {
  Id: number;
  Nombre: string;
}

export interface CrearMarcaDTO {
  nombre: string;
}

export interface ActualizarMarcaDTO {
  nombre?: string;
}
