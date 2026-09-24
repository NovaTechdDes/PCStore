export interface Movimiento {
    ProductoId: number;
    Tipo: string;
    Cantidad: number;
    Referencia?: string;
    usuarioId?: string;
    Fecha: Date;
    Precio: number;
    }

export interface MovimientoBackend extends Movimiento{
    Id: string;
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
