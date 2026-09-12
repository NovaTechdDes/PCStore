export interface Movimiento {
    productoId: number;
    tipo: string;
    cantidad: number;
    referencia?: string;
    usuarioId?: string;
    numeroFactura?: string;
    tipoVenta?: string;
    cliente?: number;
}

export interface AjustarStockDTO {
    productoId: number;
    stock: number;
    tipo: string;
    cant: number;
    descripcion?: string;
    vendedor?: number;
    series?: Serie[];
}

export interface Serie {
    nro_serie: string;
    numeroFactura: string;
    proveedorId: number;
}
