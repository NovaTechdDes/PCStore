export interface Categoria {
  Id_categoria: number;
  Nombre: string;
  Descripcion?: string;
  TotalProductos?: number;
  Activo: boolean;
}

export interface CrearCategoriaDTO {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
  descripcion?: string;
  activo: boolean
}
