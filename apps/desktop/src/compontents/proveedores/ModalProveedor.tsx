import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useProveedorStore } from '../../store';
import { useStartPostProveedor, useStartPutProveedor } from '../../hooks';
import { mensaje } from '../../helper';

export const ModalProveedor = () => {
  const { setModalAbierto, setProveedor, proveedor } = useProveedorStore();

  const { mutateAsync: crearProveedor, isPending: creando } = useStartPostProveedor();
  const { mutateAsync: actualizarProveedor, isPending: actualizando } = useStartPutProveedor();

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
  });

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedor(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      mensaje('El nombre del proveedor es obligatorio', 'error');
      return;
    }

    if (!formData.contacto.trim()) {
      mensaje('El nombre del contacto es obligatorio', 'error');
      return;
    }

    try {
      if (proveedor) {
        const res = await actualizarProveedor({
          data: {
            nombre: formData.nombre.trim(),
            contacto: formData.contacto.trim(),
            telefono: formData.telefono.trim() || null,
            email: formData.email.trim() || null,
          },
          id: proveedor.Id,
        });

        if (res) {
          mensaje(`Proveedor ${formData.nombre} actualizado correctamente`, 'success');
          cerrarModal();
        } else {
          mensaje('Error al actualizar el proveedor', 'error');
        }
      } else {
        const res = await crearProveedor({
          nombre: formData.nombre.trim(),
          contacto: formData.contacto.trim(),
          telefono: formData.telefono.trim() || null,
          email: formData.email.trim() || null,
        });

        if (res) {
          mensaje(`Proveedor ${formData.nombre} creado correctamente`, 'success');
          cerrarModal();
        } else {
          mensaje('Error al crear el proveedor', 'error');
        }
      }
    } catch (error) {
      console.error(error);
      mensaje('Ocurrió un error inesperado al guardar el proveedor', 'error');
    }
  };

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.Nombre || '',
        contacto: proveedor.Contacto || '',
        telefono: proveedor.Telefono || '',
        email: proveedor.Email || '',
      });
    } else {
      setFormData({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
      });
    }
  }, [proveedor]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <LocalShippingIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {proveedor ? `Modificando datos de ${proveedor.Nombre}` : 'Registra un distribuidor o contacto de compras'}
              </p>
            </div>
          </div>
          <button
            onClick={cerrarModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4 overflow-y-auto">
          {/* Nombre / Empresa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              Empresa / Proveedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: ASUS Oficial, Kingston Distribución, New Tree SRL..."
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>

          {/* Persona de Contacto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
              Persona de Contacto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Juan Pérez (Ejecutivo de cuentas)"
              value={formData.contacto}
              onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>

          {/* Teléfono y Email en dos columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                placeholder="Ej: +54 9 11 4433-2211"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="ventas@distribuidor.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
              />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <SaveIcon className="w-4 h-4" />
              <span>{proveedor ? 'Actualizar Proveedor' : 'Guardar Proveedor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
