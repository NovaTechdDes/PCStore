export interface Venta {
    Id: number;
    Fecha: string;
    ClienteId: number;
    UsuarioId: number;
    Total: number; 
    Activo: boolean;


    // Datos Clientes
    ClieteNombre: string;
    ClienteTelefono: string;
    ClienteDomicilio: string;
}

export interface CreateVenta {
    fecha: string,
    clienteId: number,
    usuarioId: number;
    total: number;
    activo: boolean

    clienteNombre: string;
    clienteTelefono: string;
    clienteDomicilio: string;
    
}

export interface VentaDetalle {
    Id: number;
    IdVenta: number;
    ProductoId: number;
    Cantidad: number;
    PrecioUnitario: number;
}