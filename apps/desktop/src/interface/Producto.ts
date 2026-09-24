export interface ProductoCaracteristica {
  Id?: number;
  ProductoId?: number;
  Clave: string;
  Valor: string;
}

export interface ProductoImagen {
  Id: number;
  ProductoId: number;
  RutaArchivo: string;
  EsPrincipal: boolean;
}

export interface Producto {
  Id: number;
  CodigoInterno: string;
  CodigoBarra?: string | null;
  cod_fabrica?: string | null;
  Descripcion: string;

  MarcaId?: number | null;
  ProveedorId?: number | null;
  CategoriaId?: number | null;
  UnidadId?: number | null;

  Costo: number;
  CostoDolar: number;
  IVA: number;
  Ganancia: number;
  Precio: number;
  Stock: number;
  
  Activo: boolean;

  // Propiedades unidas de relaciones (JOINs)
  MarcaNombre?: string | null;
  CategoriaNombre?: string | null;
  ProveedorNombre?: string | null;
  UnidadNombre?: string | null;

  caracteristicas?: ProductoCaracteristica[];
  imagenes?: ProductoImagen[];
  imagen?: string | null;
}

export interface CaracteristicaDTO {
  clave: string;
  valor: string;
}

export interface CrearProductoDTO {
  codigoInterno: string;
  codigoBarra?: string;
  descripcion: string;
  cod_fabrica?: string;
  
  marcaId?: number;
  proveedorId?: number;
  unidadId?: number;
  categoriaId?: number;

  costo?: number;
  costoDolar?: number;
  iva?: number;
  ganancia?: number;
  precio?: number;

  stock?: number;
  caracteristicas?: CaracteristicaDTO[];
  imagen?: File | string | null;
    eliminarImagen?: boolean;

}

export interface ActualizarProductoDTO {
  Id?: number;
  id?: number;
  codigoInterno?: string;
  codigoBarra?: string;
  descripcion?: string;
  cod_fabrica?: string;

  marcaId?: number;
  proveedorId?: number;
  unidadId?: number;
  categoriaId?: number;
  
  costo?: number;
  costoDolar?: number;
  iva?: number;
  ganancia?: number;
  precio?: number;

  stock?: number;
  imagen?: File | string | null;
  eliminarImagen?: boolean;
}

export interface FiltrosProductoDTO {
  todos?: string;
  marcaId?: number;
  proveedorId?: number;
  buscar?: string;
}

export interface ProductoCarrito {
    id: number;
    descripcion: string;
    precio: number;
    cantidad: number;
    impuesto: number;
    marca: string;
    productoOriginal?: Producto;
    codigoAux?: string;
    series?: string;
}