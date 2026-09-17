import { Presupuesto, Venta } from "../interface";

export const imprimirPresupuesto = (presupuesto: Presupuesto, dolar: number) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
}

export const imprimirRemito = {

}

export const imprimirVenta = (venta: Venta, dolar: number) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;





    
}