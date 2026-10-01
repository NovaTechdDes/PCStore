import { Presupuesto } from '../../interface';
import { getProductImageUrl } from '../../helper';

interface Props {
  presupuesto: Presupuesto;
  dolar: number;
}

export const PresupuestoPrint = ({ presupuesto, dolar }: Props) => {
  return (
    <div className="w-full max-w-[210mm] mx-auto p-4 text-black font-sans leading-tight bg-white box-border">
      {/* Encabezado comercial */}

      <header className="border-2 border-slate-900 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-12 gap-3 items-center border-b border-slate-300 pb-3 mb-3">
          {/* Datos del emisor */}

          <div className="col-span-5 border-r border-slate-300 pr-3">
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">9 Tech</h1>
            <p className="text-[11px] text-slate-600">(3228) Chajarí, Entre Ríos</p>
            <p className="text-[11px] text-slate-600">3456445977</p>
          </div>

          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-2 border-slate-900 rounded-lg font-black text-2xl flex items-center justify-center bg-slate-100 shadow-xs">P</div>
            <span className="text-[9px] font-black uppercase text-slate-800 tracking-wider mt-1">COTIZACIÓN</span>
            <span className="text-[7.5px] font-bold uppercase text-slate-500 mt-0.5 leading-none">No válido como factura</span>
          </div>

          <div className="col-span-5 pl-3 text-right">
            <h2 className="text-base font-black text-slate-900 tracking-wide uppercase">PRESUPUESTO</h2>
            <p className="text-base font-mono font-black text-amber-600">N° {presupuesto.Id?.toString().padStart(8, '0') || '00000000'}</p>
            <p className="text-xs mt-1 text-slate-700">
              <strong>Fecha:</strong> {new Date(presupuesto.Fecha).toLocaleDateString('es-AR')}
            </p>
            <p className="text-[11px] text-slate-500">
              <strong>Validez:</strong> 7 días corridos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-xs font-semibold text-slate-700 pt-1">
          <div>
            <strong>I.V.A.:</strong> Responsable Inscripto
          </div>
          <div className="text-right">
            <strong>C.U.I.T.:</strong> 27-34010523-1
          </div>
        </div>
      </header>

      {/* 2. Datos del Cliente */}
      <section className="border border-slate-400 rounded-xl p-3 text-xs mb-4 bg-slate-50/50">
        <div className="grid grid-cols-12 gap-x-4 gap-y-1.5">
          <div className="col-span-8">
            <strong className="text-slate-500 uppercase text-[10px]">Cliente / Razón Social:</strong>
            <p className="font-bold text-slate-900 uppercase text-sm">{presupuesto.ClienteNombre || 'Consumidor Final'}</p>
          </div>
          <div className="col-span-4 text-right">
            <strong className="text-slate-500 uppercase text-[10px]">Código Cliente:</strong>
            <p className="font-mono font-bold text-slate-800">#{presupuesto.ClienteId || 1}</p>
          </div>
          <div className="col-span-8">
            <strong className="text-slate-500 uppercase text-[10px]">Domicilio:</strong>
            <p className="font-medium text-slate-800">{presupuesto.ClienteDomicilio || '-'}</p>
          </div>
          <div className="col-span-4 text-right">
            <strong className="text-slate-500 uppercase text-[10px]">Teléfono:</strong>
            <p className="font-medium text-slate-800">{presupuesto.ClienteTelefono || '-'}</p>
          </div>
        </div>
      </section>

      <div className="w-full mb-4 overflow-hidden border border-slate-400 rounded-xl">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-400 uppercase text-[10px] font-black text-slate-700 tracking-wider">
              <th className="p-2 text-center w-16">Foto</th>
              <th className="p-2">Descripción del Producto</th>
              <th className="p-2 text-center w-16">Cant.</th>
              <th className="p-2 text-right w-24">P. Unitario</th>
              <th className="p-2 text-center w-16">IVA</th>
              <th className="p-2 text-right w-28">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {presupuesto.detalles && presupuesto.detalles.length > 0 ? (
              presupuesto.detalles.map((item, index) => {
                const subtotal = item.PrecioUnitario * item.Cantidad;
                const imgUrl = getProductImageUrl(item.Imagen);
                return (
                  <tr key={item.Id || index} className="hover:bg-slate-50/50">
                    {/* Imagen */}
                    <td className="p-1.5 text-center align-middle">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.Descripcion || 'Producto'} className="w-11 h-11 object-contain rounded-md border border-slate-200 bg-white mx-auto shadow-2xs" />
                      ) : (
                        <div className="w-11 h-11 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 bg-slate-50 mx-auto font-medium">
                          Sin foto
                        </div>
                      )}
                    </td>
                    {/* Descripción y Marca */}
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.MarcaNombre && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-700 border border-amber-500/20">{item.MarcaNombre}</span>}
                        {item.CodigoInterno && <span className="text-[10px] font-mono text-slate-500">[{item.CodigoInterno}]</span>}
                      </div>
                      <p className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">{item.Descripcion || `Producto #${item.ProductoId}`}</p>
                    </td>
                    {/* Cantidad */}
                    <td className="p-2 text-center align-middle font-mono font-bold text-slate-800">{item.Cantidad}</td>
                    {/* Precio Unitario */}
                    <td className="p-2 text-right align-middle font-mono text-slate-800">
                      ${Number(item.PrecioUnitario).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {/* IVA % */}
                    <td className="p-2 text-center align-middle font-mono text-slate-600 text-[11px]">%{item.Impuesto ?? 21}</td>
                    {/* Subtotal */}
                    <td className="p-2 text-right align-middle font-mono font-black text-slate-900">
                      ${Number(subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                  No hay productos registrados en este presupuesto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-12 gap-4 items-start mb-6">
        {/* Leyenda y Observaciones */}
        <div className="col-span-7 border border-slate-300 rounded-xl p-3 text-[11px] text-slate-600 bg-slate-50">
          <p className="font-bold text-slate-800 mb-1">Términos y Condiciones:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Los precios presupuestados están sujetos a modificaciones sin previo aviso.</li>
            <li>Cotización válida por 7 días a partir de la fecha de emisión.</li>
            {dolar > 0 && (
              <li>
                Tipo de cambio de referencia: <strong>1 USD = ${dolar.toFixed(2)}</strong>
              </li>
            )}
          </ul>
        </div>
        {/* Cuadro de Totales */}
        <div className="col-span-5">
          <div className="border-2 border-slate-900 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs font-sans">
              <tbody>
                {dolar > 0 && (
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="p-2 text-slate-600 font-semibold">Equivalente en USD</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-700">
                      U$S {(Number(presupuesto.Total) / dolar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-900 text-white font-black text-sm">
                  <td className="p-2.5 uppercase tracking-wide">TOTAL ARS</td>
                  <td className="p-2.5 text-right font-mono text-base text-amber-400">${Number(presupuesto.Total).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Firma */}
      <footer className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
        <div>
          <p>Generado por Sistema PCStore</p>
        </div>
        <div className="text-center w-48">
          <div className="border-b border-slate-400 mb-1 h-12" />
          <p className="font-semibold text-slate-700 uppercase">Firma Autorizada</p>
        </div>
      </footer>
    </div>
  );
};
