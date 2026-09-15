export interface Venta {
    Id: number;
    Fecha: string;
    ClienteId: number;
    UsuarioId: number;
    Total: number; 
    Activo: number;


    // Datos Clientes
    ClieteNombre: string;
    ClienteTelefono: string;
    ClienteDomicilio: string;
}

export interface VentaDetalle {
    Id: number;
    IdVenta: number;
    ProductoId: number;
    Cantidad: number;
    PrecioUnitario: number;
}