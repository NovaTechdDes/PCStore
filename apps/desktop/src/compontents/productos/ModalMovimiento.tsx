import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { useProductoStore } from '../../store';
import Loading from '../ui/Loading';
import { MovimientoBackend } from '../../interface/Movimiento';
import { startGetMov } from '../../hooks';
import { MovimientoItem } from './MovimientoItem';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalMovimiento = ({ setShowModal }: Props) => {
  const { productoSeleccionado, setProducto } = useProductoStore();

  if (!productoSeleccionado) return null;

  const { data, isLoading } = startGetMov(productoSeleccionado.Id);

  const handleClose = () => {
    setShowModal(false);
    setProducto(null);
  };

  const movimientos: MovimientoBackend[] = Array.isArray(data) ? data : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-fade-in overflow-y-auto">
      {/* Contenedor del Modal */}
      <div
        className="w-full max-w-5xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col my-8 transform scale-100 transition-all duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">Movimientos del Producto</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {productoSeleccionado.Descripcion} ({productoSeleccionado.Id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido de la Tabla */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 flex justify-center items-center">
              <Loading />
            </div>
          ) : movimientos.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400 dark:text-zinc-500">No hay movimientos registrados para este producto.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cod. Cliente</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Tipo Comp.</th>
                    <th className="px-4 py-3">Tipo Venta</th>
                    <th className="px-4 py-3 text-right">Cantidad</th>
                    <th className="px-4 py-3 text-right">Egreso</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 bg-white dark:bg-[#18181b]">
                  {movimientos.map((mov, index) => (
                    <MovimientoItem key={mov.Id || index} movimiento={mov} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botón Salir */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};
