export interface Cliente {
    
    Nombre: string;
    Cuit: string;
    CondicionIva: string;
    CondicionFacturacion: number;
    Localidad: string;
    Direccion: string;
    Telefono: string;
    Email: string;
    Observaciones: string;
    
    
    Saldo?: number;
    
}

export interface ClienteBackEnd extends Cliente {
    Id: number;
    Activo?: boolean;
}

export interface CreateCliente {
    nombre: string;
    cuit: string;
    condicionIva: string;
    condicionFacturacion: number;
    localidad: string;
    direccion: string;
    telefono: string;
    email: string;
    observaciones: string;
    vendedor: number;
}