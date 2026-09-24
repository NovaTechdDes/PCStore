import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { useProductoStore } from '../../store';

interface Props {
  setShowModal: (value: boolean) => void;
  imgUrl: string;
  alt: string;
}

export const ModalViewImg = ({ setShowModal, imgUrl, alt }: Props) => {
  const { setProducto } = useProductoStore();

  const handleClose = () => {
    setShowModal(false);
    setProducto(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md transition-all duration-200 animate-fade-in" onClick={handleClose}>
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col transform scale-100 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate" title={alt}>
                {alt || 'Vista previa de imagen'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Visualización de producto</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenedor de la Imagen */}
        <div className="p-6 flex items-center justify-center bg-slate-100/60 dark:bg-zinc-950/40 min-h-80 max-h-[70vh] overflow-hidden">
          {imgUrl ? (
            <img src={imgUrl} alt={alt} className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain drop-shadow-md select-none transition-transform duration-200 hover:scale-[1.02]" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-zinc-600 py-12">
              <ImageIcon sx={{ fontSize: 48 }} className="opacity-40" />
              <span className="text-sm">Sin imagen disponible</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
