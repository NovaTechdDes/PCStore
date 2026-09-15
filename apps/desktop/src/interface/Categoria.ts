export interface Categoria {
  Id_categoria: number;
  Nombre: string;
  Descripcion?: string;
  TotalProductos?: number;
  Activo: boolean;
}

export interface CrearCategoriaDTO {
  nombre: string;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
}
