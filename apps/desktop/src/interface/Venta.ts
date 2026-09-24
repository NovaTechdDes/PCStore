import { Usuario } from "./Usuario";

export interface Venta {
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
    NombreUsuario: string;

    detalles: VentaDetalle[];
    vendedor?: Usuario;
}

export interface VentaDetalle {
    CodigoInterno: number;
    ProductoDescripcion: string;
    Serie: string;
    Rubro: string;
    Cantidad: number;
    PrecioUnitario: number;
}

export interface CreateVenta {
    fecha: string,
    clienteId: number,
    usuarioId: number;
    total: number;
    formaPago: string;
    tipoComprobante: string;
    numeroComprobante?: string;
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