export interface ValorDolar {
  Clave: string;
  Valor: number;
}

export interface ActualizarValorDolarDTO {
  valor: number;
  recalcularPrecios?: boolean;
}

export interface ActualizarConfiguracionDTO {
  valor: number;
}
