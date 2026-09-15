export interface Cliente {
    
    nombre: string;
    cuit: string;
    condicionIva: string;
    condicionFacturacion: number;
    localidad: string;
    direccion: string;
    telefono: string;
    email: string;
    tipoCuenta: string;
    observaciones: string;
    
    
    saldo?: number;
    
}

export interface ClienteBackEnd extends Cliente {
    _id: string;
    activo?: boolean;
}