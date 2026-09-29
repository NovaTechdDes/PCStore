import { Presupuesto, Venta } from '../interface';
import ReactDOMServer from 'react-dom/server';
import { VentaPrint } from '../compontents';

export const imprimirPresupuesto = (presupuesto: Presupuesto, dolar: number) => {
  const htmlContent = ReactDOMServer.renderToString(<VentaPrint venta={presupuesto} dolar={dolar} />);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.display = 'none';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;

  if (doc) {
    doc.open();
    doc.writeln(`
          <html>
            <head>
              ${Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
                .map((style) => style.outerHTML)
                .join('')}
            </head>
            <body>
              ${htmlContent}
            </body>
          </html>`);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 250);
  }
};

export const imprimirRemito = {};

export const imprimirVenta = (venta: Venta, dolar: number) => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;

  console.log(doc, venta, dolar);
};
