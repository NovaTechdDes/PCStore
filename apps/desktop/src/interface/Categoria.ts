export interface Categoria {
  Id_categoria: number;
  Nombre: string;
}

export interface CrearCategoriaDTO {
  nombre: string;
}

export interface ActualizarCategoriaDTO {
  nombre?: string;
}
