import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { openUrl } from '@tauri-apps/plugin-opener';
import { Producto } from '../../interface';
import { mensaje } from '../../helper/mensaje';

interface Props {
  productos: Producto[];
  setShowModal: (value: boolean) => void;
}

type TypeExportar = 'whatsapp';

const NUMEROS_WHATSAPP = ['3456430019', '3456476142'];

export const ModalExportar = ({ productos, setShowModal }: Props) => {
  const [tipo, setTipo] = useState<TypeExportar>('whatsapp');
  const [numero, setNumero] = useState<string>(NUMEROS_WHATSAPP[0]);

  const productosConStock = productos.filter((p) => (p.Stock ?? 0) > 0);

  const handleExportar = async () => {
    if (productosConStock.length === 0) {
      mensaje('No hay productos con stock para exportar', 'error');
      return;
    }

    const listado = productosConStock.map((p) => `- ${p.Descripcion}${p.MarcaNombre ? ` (${p.MarcaNombre})` : ''}`).join('\n');
    const texto = `*Listado de productos*\n\n${listado}`;

    try {
      // Formato internacional Argentina para celulares: 54 + 9 + característica + número
      await openUrl(`https://wa.me/549${numero}?text=${encodeURIComponent(texto)}`);
      setShowModal(false);
    } catch (error) {
      mensaje('No se pudo abrir WhatsApp', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <IosShareIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">Exportar Productos</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{productosConStock.length} productos con stock</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sección: Destino */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Exportar a</span>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-200">
              <input
                type="radio"
                name="tipoExportar"
                value="whatsapp"
                checked={tipo === 'whatsapp'}
                onChange={(e) => setTipo(e.target.value as TypeExportar)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
              <WhatsAppIcon className="w-4 h-4 text-green-500" />
              WhatsApp
            </label>
          </div>

          {/* Sección: Número */}
          {tipo === 'whatsapp' && (
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 relative pt-5">
              <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Número</span>
              <div className="flex flex-col gap-3">
                {NUMEROS_WHATSAPP.map((num) => (
                  <label key={num} className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-200 font-mono">
                    <input
                      type="radio"
                      name="numeroWhatsapp"
                      value={num}
                      checked={numero === num}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
          >
            Salir
          </button>
          <button
            type="button"
            onClick={handleExportar}
            disabled={productosConStock.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IosShareIcon className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
