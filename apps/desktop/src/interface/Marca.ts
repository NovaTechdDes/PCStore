export interface Marca {
  Id: number;
  Nombre: string;
  Descripcion: string;
  SitioWeb?: string;
  TotalProductos: number;
  Activo: boolean;
}

export interface CrearMarcaDTO {
  nombre: string;
  descripcion?: string;
  sitioWeb?: string;
  Activo: boolean;
}

export interface ActualizarMarcaDTO {
  nombre?: string;
  descripcion?: string;
  sitioWeb?: string;
}
