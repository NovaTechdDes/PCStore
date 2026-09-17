export interface Presupuesto {
    Id: number;
    Fecha: string;
    ClienteId: number;
    UsuarioId: number;
    Total: number; 
    Activo: number;

    observaciones: string;


    // Datos Clientes
    ClieteNombre: string;
    ClienteTelefono: string;
    ClienteDomicilio: string;
}

export interface CreatePresupuesto {
    fecha: string;
    clienteId: number;
    usuarioId: number;
    total: number; 
    activo: number;

    observaciones: string;


    // Datos Clientes
    clieteNombre: string;
    clienteTelefono: string;
    clienteDomicilio: string;
}

export interface PresupuestoDetalle {
    Id: number;
    IdPresupuesto: number;
    ProductoId: number;
    Cantidad: number;
    PrecioUnitario: number;
}