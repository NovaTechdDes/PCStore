import React, { useState } from 'react';
import { Venta, VentaDetalle } from '../../interface';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useGlobalStore } from '../../store';
import Swal from 'sweetalert2';
import { startActivarCaja, startDesactviarCaja } from '../../hooks';
// import { VentaPrint } from '../Venta/VentaPrint';
// import { ReciboPrint } from '../Recibo/ReciboPrint';

interface Props {
  venta: Venta;
}

export const CajaItem = ({ venta }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { usuario } = useGlobalStore();
  const { mutateAsync, isPending } = startDesactviarCaja();
  const { mutateAsync: mutateAsyncActivar, isPending: isPendingActivar } = startActivarCaja();

  const imprimirVenta = () => {
    // const htmlContent = ReactDOMServer.renderToString(venta.tipo_comp.toUpperCase() !== 'RECIBO' ? <VentaPrint venta={venta as VentaBackend} /> : <ReciboPrint recibo={venta as ReciboBackend} />);
    // const iframe = document.createElement('iframe');
    // iframe.style.position = 'absolute';
    // iframe.style.width = '0px';
    // iframe.style.height = '0px';
    // iframe.style.display = 'none';
    // document.body.appendChild(iframe);
    // const doc = iframe.contentWindow?.document;
    // if (doc) {
    //   doc.open();
    //   doc.writeln(`
    //       <html>
    //         <head>
    //           ${Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    //             .map((style) => style.outerHTML)
    //             .join('')}
    //         </head>
    //         <body>
    //           ${htmlContent}
    //         </body>
    //       </html>`);
    //   doc.close();
    //   iframe.contentWindow?.focus();
    //   setTimeout(() => {
    //     iframe.contentWindow?.print();
    //     document.body.removeChild(iframe);
    //   }, 250);
    // }
  };

  const handleActivar = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Activar',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) {
      await mutateAsyncActivar({ id: venta.Id, tipo: venta.TipoComprobante });
    }
  };

  const handleDesactivar = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) {
      await mutateAsync({ id: venta.Id, tipo: venta.TipoComprobante });
    }
  };

  const hasMovimientos = venta.detalleVenta && venta.detalleVenta.length > 0;

  return (
    <React.Fragment>
      <tr
        key={venta.Id}
        onClick={() => setIsOpen(!isOpen)}
        className={`border-b border-slate-200 dark:border-zinc-800/80 transition-colors cursor-pointer select-none ${
          isOpen ? 'bg-amber-50/50 dark:bg-amber-500/10 hover:bg-amber-50/80 dark:hover:bg-amber-500/15' : 'bg-white dark:bg-[#18181b] hover:bg-slate-100/70 dark:hover:bg-zinc-900/60'
        }`}
      >
        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-700 dark:text-zinc-300 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all"
              title={isOpen ? 'Ocultar movimientos' : 'Ver movimientos'}
            >
              {isOpen ? <KeyboardArrowDownIcon className="w-5 h-5 text-amber-500" /> : <KeyboardArrowRightIcon className="w-5 h-5" />}
            </button>
            <span>{venta.Fecha}</span>
          </div>
        </td>
        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-zinc-100">{venta.ClieteNombre}</td>

        <td className="py-3.5 px-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {venta.TipoComprobante}
          </span>
        </td>
        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-zinc-100 whitespace-nowrap">${Number(venta.Total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
        <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 font-medium text-xs">{venta.vendedor?.NombreUsuario || '-'}</td>
        {/* Acciones */}
        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                imprimirVenta();
              }}
              className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <PrintIcon sx={{ fontSize: 18 }} />
            </button>

            {usuario?.Rol === 'admin' && (
              <button
                type="button"
                onClick={() => (venta.Activo ? handleDesactivar() : handleActivar())}
                disabled={venta.Activo ? isPending : isPendingActivar}
                className="p-1.5 text-slate-500 dark:text-zinc-400 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
              >
                {venta.Activo ? <DeleteIcon sx={{ color: '#ef4444', fontSize: 18 }} /> : <GroupAddIcon sx={{ color: '#22c55e', fontSize: 18 }} />}
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Sub-fila Desplegable con la Tabla de Movimientos (Items) */}
      {isOpen && (
        <tr className="bg-slate-100/70 dark:bg-zinc-900/80 border-b border-slate-300 dark:border-zinc-700">
          <td colSpan={7} className="px-8 py-4">
            <div className="bg-white dark:bg-[#18181b] rounded-xl border border-slate-300 dark:border-zinc-700 shadow-sm overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                <Inventory2OutlinedIcon className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Movimientos / Artículos de la Venta</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold ml-auto border border-amber-300/50 dark:border-amber-500/30">
                  {venta.detalleVenta?.length || 0} ítems
                </span>
              </div>

              {!hasMovimientos ? (
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 py-3 text-center italic">Esta venta no registra detalle de movimientos.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60">
                        <th className="py-2.5 px-3">{venta.TipoComprobante === 'Recibo' ? 'Fecha' : 'Producto / Servicio'}</th>
                        <th className="py-2.5 px-3">{venta.TipoComprobante === 'Recibo' ? 'Comprobante' : 'N° Serie'}</th>
                        <th className="py-2.5 px-3">{venta.TipoComprobante === 'Recibo' ? 'Numero' : 'Rubro'}</th>
                        <th className="py-2.5 px-3 text-right">{venta.TipoComprobante === 'Recibo' ? 'Pagado' : 'Cantidad'}</th>
                        <th className="py-2.5 px-3 text-right">{venta.TipoComprobante === 'Recibo' ? 'Saldo' : 'Precio Unit.'}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60 text-xs">
                      {(venta.detalleVenta as VentaDetalle[])?.map((mov, index) => {
                        const subtotal = (mov.cantidad || 0) * (mov.precio || 0);
                        return (
                          <tr key={mov.Id || index} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-zinc-400 font-medium">{mov.codProd || '-'}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-zinc-200">{mov.producto}</td>
                            <td className="py-2.5 px-3 font-mono text-amber-700 dark:text-amber-400 font-bold">{mov.serie || '-'}</td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-zinc-400">{mov.rubro || '-'}</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-slate-800 dark:text-zinc-200">{mov.cantidad}</td>
                            <td className="py-2.5 px-3 text-right font-medium text-slate-700 dark:text-zinc-300">
                              $
                              {mov.precio?.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-amber-700 dark:text-amber-400">
                              $
                              {subtotal.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};
