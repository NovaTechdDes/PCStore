import { usecategoriaStore } from '../../store';

import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import { useEffect, useState } from 'react';
import { useStartPostCategoria, useStartPutCategoria } from '../../hooks';
import { mensaje } from '../../helper';

export const ModalCategoria = () => {
  const { setModalAbierto, setCategoria, categoria } = usecategoriaStore();

  const { mutateAsync: crearCategoria, isPending: creando } = useStartPostCategoria();
  const { mutateAsync: actualizarCategoria, isPending: actualizando } = useStartPutCategoria();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoria(null);
  };

  const handleSubmit = async () => {
    if (categoria) {
      const res = await actualizarCategoria({ data: formData, id: categoria.Id });

      if (res) {
        mensaje(`Categoría ${formData.nombre} actualizada correctamente`, 'success');
        cerrarModal();
      } else {
        mensaje('Error al actualizar la categoría', 'error');
      }
    } else {
      const res = await crearCategoria(formData);

      if (res) {
        mensaje(`Categoría ${formData.nombre} creada correctamente`, 'success');
        cerrarModal();
      } else {
        mensaje('Error al crear la categoría', 'error');
      }
    }
  };

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.Nombre,
        descripcion: categoria.Descripcion || '',
        activo: categoria.Activo,
      });
    }
  }, [categoria]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">{categoria ? `Modificando detalles de ${categoria.Nombre}` : 'Define una nueva familia de productos y sus márgenes'}</p>
            </div>
          </div>
          <button
            onClick={cerrarModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario (Diseño sin lógica backend) */}
        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4 overflow-y-auto">
          {/* Nombre de la Categoría */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Procesadores, Placas de Video, Monitores..."
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>

          {/* Descripción de la Categoría */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Descripción</label>
            <textarea
              rows={3}
              placeholder="Detalles sobre los tipos de hardware o periféricos incluidos..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500 resize-none"
            />
          </div>

          {/* Estado: Activa / Inactiva */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">Estado de la Categoría</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, activo: true })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  formData.activo
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Activa</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, activo: false })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  formData.activo === false
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                    : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Inactiva</span>
              </button>
            </div>
          </div>

          {/* Botones de acción del modal */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={creando || actualizando}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <SaveIcon className="w-4 h-4" />
              <span>{categoria ? 'Actualizar Categoría' : 'Guardar Categoría'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
