export interface Presupuesto {
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

export interface PresupuestoDetalle {
    Id: number;
    IdPresupuesto: number;
    ProductoId: number;
    Cantidad: number;
    PrecioUnitario: number;
}