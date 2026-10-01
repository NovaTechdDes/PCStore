import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import { getPresupuestoById } from '../../services/presupuesto.service';
import { imprimirPresupuesto } from '../../helper/imprimir';
import { mensaje } from '../../helper/mensaje';
import Loading from '../ui/Loading';
import { usePresupuestos } from '../../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalListarPresupuestos = ({ isOpen, onClose }: Props) => {
  const [buscar, setBuscar] = useState('');
  const [reimprimiendoId, setReimprimiendoId] = useState<number | null>(null);

  const { data: presupuestos = [], isLoading } = usePresupuestos();

  if (!isOpen) return null;

  const handleReimprimir = async (id: number) => {
    try {
      setReimprimiendoId(id);
      const presCompleto = await getPresupuestoById(id);
      if (presCompleto) {
        imprimirPresupuesto(presCompleto, presCompleto.Dolar || 0);
        mensaje('Presupuesto enviado a impresión', 'success');
      } else {
        mensaje('No se pudo cargar el presupuesto', 'error');
      }
    } catch (e) {
      console.error(e);
      mensaje('Error al reimprimir presupuesto', 'error');
    } finally {
      setReimprimiendoId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <RequestQuoteIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">Historial de Presupuestos</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Buscar y reimprimir cotizaciones emitidas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar por nombre de cliente o número..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Listado */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loading text="Cargando presupuestos..." />
            </div>
          ) : presupuestos?.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500 italic">No se encontraron presupuestos emitidos.</div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">N° Cotización</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3 text-right">Total ($ ARS)</th>
                  <th className="py-2.5 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {presupuestos?.map((p) => (
                  <tr key={p.Id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">#{p.Id.toString().padStart(6, '0')}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-zinc-400">{new Date(p.Fecha).toLocaleDateString('es-AR')}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-zinc-200">{p.ClienteNombre || 'Consumidor Final'}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">${Number(p.Total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleReimprimir(p.Id)}
                        disabled={reimprimiendoId === p.Id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        title="Reimprimir Presupuesto"
                      >
                        <PrintIcon sx={{ fontSize: 15 }} />
                        <span>{reimprimiendoId === p.Id ? 'Cargando...' : 'Reimprimir'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
