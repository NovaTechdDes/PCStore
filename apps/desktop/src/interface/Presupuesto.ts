export interface Presupuesto {
    Id: number;
    Fecha: string;
    ClienteId: number;
    UsuarioId: number;
    Total: number; 
    FormaPago: string;
    TipoComprobante: string;
    NumeroComprobante?: string;
    Activo: boolean;


    // Datos Clientes
    ClienteNombre: string;
    ClienteTelefono: string;
    ClienteDomicilio: string;
}

export interface CreatePresupuesto {
    fecha: string;
    clienteId: number;
    usuarioId: number;
    total: number; 
    formaPago: string;
    tipoComprobante: string;
    numeroComprobante?: string;
    activo: boolean;

    // Datos Clientes
    clienteNombre: string;
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