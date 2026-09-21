import { useEffect, useState } from 'react';
import { useCajas } from '../hooks/useCajas';
import { useCajaStore } from '../store';
import { Cabecera, CajaItem, Loading } from '../compontents';
import { Venta } from '../interface';

export const Cajas = () => {
  const { desde, hasta, setDesde, setHasta, buscador, setBuscador } = useCajaStore();
  const [desactivados, setDesactivados] = useState<boolean>(false);
  const { data, isLoading } = useCajas(desde, hasta, desactivados);

  const [tipo, setTipo] = useState<'CD' | 'PP' | 'CC' | 'RC'>('CD');
  const [ventasAMostrar, setVentasAMostrar] = useState([]);

  const { ventas = [], recibos = [], presupuestos = [] } = data || { ventas: [], recibos: [], presupuestos: [] };

  useEffect(() => {
    if (tipo === 'CD') {
      const aux = ventas.filter((venta: Venta) => venta.TipoComprobante === 'CD');
      setVentasAMostrar(aux);
    } else if (tipo === 'PP') {
      const aux = presupuestos;
      setVentasAMostrar(aux);
    } else if (tipo === 'CC') {
      const aux = ventas.filter((venta: Venta) => venta.TipoComprobante === 'CC');
      setVentasAMostrar(aux);
    } else {
      setVentasAMostrar(recibos);
    }
  }, [tipo, data]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header - Pestañas Principales */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="flex w-full divide-x divide-slate-200 dark:divide-zinc-800">
          <button
            onClick={() => setTipo('CD')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              tipo === 'CD' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setTipo('PP')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              tipo === 'PP' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Presupuestos
          </button>
          <button
            onClick={() => setTipo('CC')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              tipo === 'CC' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Cuenta Corriente
          </button>
          <button
            onClick={() => setTipo('RC')}
            className={`flex-1 py-3 px-4 text-center font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${
              tipo === 'RC' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Recibos
          </button>
        </div>
      </div>

      <Cabecera titulo="Caja" descripcion="Gestion de caja" buscador={buscador} setBuscador={setBuscador} funcion={() => {}}>
        <label
          htmlFor="clientesDesactivados"
          className="inline-flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-xl cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all text-slate-800 dark:text-zinc-300 font-medium text-sm w-full sm:w-auto"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-400 whitespace-nowrap">Ver Desactivados</span>
          <div className="relative inline-flex items-center">
            <input id="clientesDesactivados" type="checkbox" checked={desactivados} onChange={() => setDesactivados(!desactivados)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500"></div>
          </div>
        </label>
      </Cabecera>

      {/* Header - Sub-Filtros y Fechas */}
      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Total destacado */}
        <div className="bg-white dark:bg-zinc-800/90 px-4 py-2 rounded-xl border border-amber-300/80 dark:border-amber-700/50 shadow-xs flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Total acumulado</span>
          <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">
            ${ventasAMostrar.reduce((acc: number, venta: Venta) => acc + Number(venta.Total || 0), 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Filtro de fechas */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm text-slate-800 dark:text-zinc-100 focus:outline-none shadow-xs font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm text-slate-800 dark:text-zinc-100 focus:outline-none shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      {isLoading && <Loading fullScreen text="Cargando datos" />}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="max-h-125 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider z-10 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Tipo de Pago</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4">Vendedor</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80 text-sm text-slate-800 dark:text-zinc-200">
              {ventasAMostrar.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm font-medium text-slate-500 dark:text-zinc-400 italic">
                    No hay ventas registradas para este periodo
                  </td>
                </tr>
              ) : (
                ventasAMostrar.map((venta: Venta) => <CajaItem key={venta.Id} venta={venta} />)
              )}
            </tbody>
          </table>
          <div className="h-16 w-full"></div>
        </div>
      </div>
    </div>
  );
};
