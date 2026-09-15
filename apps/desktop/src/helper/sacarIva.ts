import { ProductoCarrito } from '../interface';

export const sacarIva = (lista: ProductoCarrito[]) => {
  let totalIva21 = 0;
  let gravado21 = 0;
  let totalIva105 = 0;
  let gravado105 = 0;

  lista.forEach(({ cantidad, impuesto, precio }) => {
    if (impuesto === 21) {
      gravado21 += (cantidad * precio) / 1.21;
      totalIva21 += (((cantidad * precio) / 1.21) * 21) / 100;
    } else if (impuesto === 10.5) {
      gravado105 += (cantidad * precio) / 1.105;
      totalIva105 += (((cantidad * precio) / 1.105) * 10.5) / 100;
    }
  });

  let cantIva = 0;

  if (gravado21 !== 0) {
    cantIva++;
  }
  if (gravado105 !== 0) {
    cantIva++;
  }

  return [parseFloat(totalIva21.toFixed(2)), parseFloat(gravado21.toFixed(2)), parseFloat(totalIva105.toFixed(2)), parseFloat(gravado105.toFixed(2)), cantIva];
};
