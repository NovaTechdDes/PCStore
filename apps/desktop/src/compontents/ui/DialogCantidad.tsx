import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setCantidad: (cantidad: number) => void;
  initialCantidad?: number;
}

export const DialogCantidad = ({ isOpen, onClose, setCantidad, initialCantidad = 1 }: Props) => {
  const [value, setValue] = useState<number | string>(initialCantidad);

  useEffect(() => {
    if (isOpen) {
      setValue(initialCantidad);
    }
  }, [isOpen, initialCantidad]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    if (!isNaN(num)) {
      setCantidad(num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-xs bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800/60">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Ingrese la cantidad</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="cantidad-input" className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">
              Cantidad
            </label>
            <input
              id="cantidad-input"
              type="number"
              step="any"
              autoFocus
              onFocus={(e) => e.target.select()} // 👈 Agregás esto
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-center font-mono font-bold text-lg text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-600 dark:text-zinc-300 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl transition-all cursor-pointer shadow-xs">
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
