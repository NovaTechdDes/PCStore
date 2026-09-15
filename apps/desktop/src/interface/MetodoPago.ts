export type TipoMetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';

export interface PagoEfectivo {
  tipo: 'efectivo';
  monto: number;
}

export interface PagoTransferencia {
  tipo: 'transferencia';
  monto: number;
  observacion?: string;
}

export interface PagoTarjeta {
  tipo: 'tarjeta';
  tarjeta: string; // Ej: Visa, Visa Débito, Mastercard, etc.
  monto: number;
  cliente?: string;
  tipoComprobante?: string;
}

export interface PagoCheque {
  tipo: 'cheque';
  fecha: string;
  fechaVencimiento: string;
  banco: string;
  numero: string;
  monto: number;
  cliente: string;
  direccion?: string;
  telefono?: string;
}

export type MetodoPagoDetalle = PagoEfectivo | PagoTransferencia | PagoTarjeta | PagoCheque;

export interface MetodoPago {
  nombre: 'tarjeta' | 'efectivo' | 'transferencia' | 'cheque';
  monto: number;
  nroCheque?: string;
  tipoTarjeta?: string;
  tipo?: string;
  nro_comp?: string
}

export interface MetodoPagoBackend extends MetodoPago {
  _id: string;
  activo: boolean;
}