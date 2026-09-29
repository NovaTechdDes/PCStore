import { Venta } from '../../interface';
import { Presupuesto } from '../../interface/Presupuesto';

interface Props {
  venta: Venta | Presupuesto;
  dolar?: number;
}

export const VentaPrint = ({ venta, dolar = 0 }: Props) => {
  const tipoUpper = (venta.TipoComprobante || '').toUpperCase();

  const getLetraYCodigo = () => {
    if (tipoUpper.includes('FACTURA A')) return { letra: 'A', cod: 'COD. 01' };
    if (tipoUpper.includes('CREDITO A') || (tipoUpper.includes('NOTA') && tipoUpper.includes('A'))) return { letra: 'A', cod: 'COD. 03' };
    if (tipoUpper.includes('FACTURA B')) return { letra: 'B', cod: 'COD. 06' };
    if (tipoUpper.includes('CREDITO B') || (tipoUpper.includes('NOTA') && tipoUpper.includes('B'))) return { letra: 'B', cod: 'COD. 08' };
    if (tipoUpper.includes('PRESUPUESTO')) return { letra: 'P', cod: '' };
    if (tipoUpper.includes('REMITO')) return { letra: 'R', cod: '' };
    if (tipoUpper.includes('CONTADO') || tipoUpper.includes('CD')) return { letra: 'X', cod: '' };
    return { letra: 'X', cod: '' };
  };

  const { letra, cod } = getLetraYCodigo();
  const numeroMostrar = venta.Id?.toString().padStart(8, '0') || '00000000';

  console.log(venta.detalles[0]);

  return (
    <div className="w-full min-h-[128mm] flex flex-col justify-between box-border">
      <div>
        {/* Datos dueño */}
        <header className="border border-black p-3 text-xs mb-3 text-black font-sans leading-tight">
          <div className="grid grid-cols-12 gap-2 items-center border-b border-black pb-2 mb-2">
            {/* Columna Izquierda: Emisor */}
            <div className="col-span-5 border-r border-black pr-2">
              <h1 className="text-base font-black tracking-tight uppercase">PROAR SEGURIDAD</h1>
              <p className="font-semibold">De: Paccot Carla</p>
              <p className="text-[11px] text-gray-700">Av. Alem 2196 - Tel: 3456-593374</p>
              <p className="text-[11px] text-gray-700">(3228) - Chajarí, Entre Ríos</p>
            </div>

            {/* Columna Central: Tipo de Comprobante / Letra */}
            <div className="col-span-2 flex flex-col items-center justify-center">
              <div className="w-9 h-9 border-2 border-black font-black text-xl flex items-center justify-center bg-gray-100">{letra}</div>
              {cod && <span className="text-[8px] font-bold tracking-tight mt-0.5">{cod}</span>}
              <span className={`text-[8px] font-bold uppercase text-center mt-0.5 leading-none ${'text-gray-600'}`}>Documento no válido como factura</span>
            </div>

            {/* Columna Derecha: Datos de Comprobante */}
            <div className="col-span-5 pl-3">
              <div className="text-right">
                <h2 className="text-sm font-black uppercase tracking-wide">{venta.TipoComprobante}</h2>
                <p className="text-sm font-mono font-bold">N° {numeroMostrar}</p>
                <p className="mt-1">
                  <strong>Fecha:</strong> {new Date(venta.Fecha).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          {/* Fila Inferior: Condición Fiscal & CUIT */}
          <div className="grid grid-cols-2 text-[11px] font-medium pt-0.5">
            <div>
              <strong>I.V.A.:</strong> Responsable Inscripto
            </div>
            <div className="text-right">
              <strong>C.U.I.T.:</strong> 27-34010523-1
            </div>
          </div>
        </header>

        {/* Datos Cliente */}
        <section className="border border-black p-2 text-xs mb-3 text-black font-sans leading-tight">
          <div className="grid grid-cols-12 gap-x-3 gap-y-1">
            {/* Nombre y Código */}
            <div className="col-span-8">
              <strong>Señor(es):</strong> <span className="uppercase font-semibold">{venta.ClienteNombre}</span>
            </div>
            <div className="col-span-4 text-right">
              <strong>Código Cliente:</strong> <span className="font-mono">{venta.ClienteId}</span>
            </div>

            {/* Dirección y Localidad */}
            <div className="col-span-8">
              <strong>Dirección:</strong> {venta.ClienteDomicilio || '-'}
            </div>
            <div className="col-span-4 text-right">
              <strong>Teléfono:</strong> {venta.ClienteTelefono || '-'}
            </div>

            {/* CUIT/DNI y Condición de IVA */}
            {/* <div className="col-span-6">
              <strong>{venta.ClienteCuil && venta.ClienteCuil.length > 8 ? 'C.U.I.T.:' : 'D.N.I.:'}</strong> {venta.ClienteCuil || '-'}
            </div>
            <div className="col-span-6 text-right">
              <strong>Cond. I.V.A.:</strong> {venta.ClienteCondicionIva || 'Consumidor Final'}
            </div> */}
          </div>
        </section>

        {/* Tabla de productos */}
        <div className="w-full mb-4 grow">
          <table className="w-full text-xs text-left border-collapse border border-black font-sans leading-tight">
            <thead>
              <tr className="bg-gray-100 border-b border-black uppercase text-[11px] font-bold">
                <th className="p-1.5 border-r border-black text-center w-16">Cant.</th>
                <th className="p-1.5 border-r border-black w-24">Código</th>
                <th className="p-1.5 border-r border-black">Descripción</th>
                <th className="p-1.5 border-r border-black w-28">N° Serie</th>
                <th className="p-1.5 border-r border-black text-right w-24">P. Unit</th>
                <th className="p-1.5 border-r border-black text-center w-16">IVA %</th>
                <th className="p-1.5 text-right w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles?.map((mov) => {
                return (
                  <tr key={mov.Id} className="border-b border-gray-300">
                    <td className="p-1.5 border-r border-black text-center font-mono">{mov.Cantidad}</td>
                    <td className="p-1.5 border-r border-black font-mono text-[11px]">{mov.ProductoId}</td>
                    <td className="p-1.5 border-r border-black text-right font-mono text-[11px]">{(mov.PrecioUnitario / (dolar || 1)).toFixed(2)}</td>
                    <td className="p-1.5 text-right font-mono text-[11px]">{((mov.PrecioUnitario * mov.Cantidad) / (dolar || 1)).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div className="flex justify-end mt-auto pt-2">
        <div className="w-64">
          <table className="w-full text-xs border-collapse border border-black font-sans leading-tight">
            <tbody>
              {dolar > 0 && (
                <tr className="border-b border-black">
                  <td className="p-1.5 border-r border-black font-semibold text-left bg-gray-50">Dólar Tomado</td>
                  <td className="p-1.5 font-mono text-right font-semibold">${dolar.toFixed(2)}</td>
                </tr>
              )}
              <tr className="bg-gray-100 font-bold text-sm">
                <td className="p-2 border-r border-black uppercase text-left">Total</td>
                <td className="p-2 font-mono text-right">${(dolar ? venta.Total / dolar : venta.Total).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
