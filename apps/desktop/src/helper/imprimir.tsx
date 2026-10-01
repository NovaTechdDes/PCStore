import { Presupuesto, Venta } from '../interface';
import ReactDOMServer from 'react-dom/server';
import { PresupuestoPrint } from '../compontents';

export const imprimirPresupuesto = (presupuesto: Presupuesto, dolar: number) => {
  const htmlContent = ReactDOMServer.renderToString(<PresupuestoPrint presupuesto={presupuesto} dolar={dolar} />);

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
         <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Presupuesto #${presupuesto.Id}</title>
          ${Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((style) => style.outerHTML)
            .join('')}
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 10mm; size: auto; }
            }
          </style>
        </head>
        <body class="bg-white">
          ${htmlContent}
        </body>
      </html>`);
    doc.close();

    const imgs = Array.from(doc.images);
    const waitImages = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continúa aunque una imagen falle
      });
    });

    Promise.all(waitImages).then(() => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 200);
    });
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
