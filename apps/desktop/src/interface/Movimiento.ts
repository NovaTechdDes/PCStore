export interface Movimiento {
    productoId: number;
    tipo: string;
    cantidad: number;
    referencia?: string;
    usuarioId?: string;
    numeroFactura?: string;
    tipoVenta?: string;
    cliente?: number
}