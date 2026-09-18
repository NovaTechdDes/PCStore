import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useStartPutCliente, useStartPostCliente, useCodigoNext } from '../../hooks/useClientes';
import { mensaje } from '../../helper/mensaje';
import { useClienteStore, useGlobalStore } from '../../store';
import { CreateCliente } from '../../interface';

interface Props {
  onClose: () => void;
}

export const ModalCliente = ({ onClose }: Props) => {
  const { usuario } = useGlobalStore();
  const { clienteSeleccinado, setCliente } = useClienteStore();

  const { data: codigo, isLoading } = useCodigoNext();
  const { mutateAsync: mutateAsyncCrear, isPending: isPendingCrear } = useStartPostCliente();
  const { mutateAsync: mutateAsyncActualizar, isPending: isPendingActualizar } = useStartPutCliente();

  const [formData, setFormData] = useState({
    id: clienteSeleccinado ? clienteSeleccinado.Id : (codigo ?? 0),
    nombre: clienteSeleccinado?.Nombre ?? '',
    cuit: clienteSeleccinado?.Cuit ?? '',
    condicionIva: clienteSeleccinado?.CondicionIva ?? 'Consumidor Final',
    condicionFacturacion: clienteSeleccinado?.CondicionFacturacion ?? 1,
    localidad: clienteSeleccinado?.Localidad ?? '',
    direccion: clienteSeleccinado?.Direccion ?? '',
    telefono: clienteSeleccinado?.Telefono ?? '',
    email: clienteSeleccinado?.Email ?? '',
    observaciones: clienteSeleccinado?.Observaciones ?? '',
    vendedor: usuario?.Id,
  });

  useEffect(() => {
    if(!usuario) return;
    if (clienteSeleccinado) {
      setFormData({
        id: clienteSeleccinado.Id,
        nombre: clienteSeleccinado.Nombre || '',
        cuit: clienteSeleccinado.Cuit || '',
        condicionIva: clienteSeleccinado.CondicionIva || 'Consumidor Final',
        condicionFacturacion: clienteSeleccinado.CondicionFacturacion || 1,
        localidad: clienteSeleccinado.Localidad || '',
        direccion: clienteSeleccinado.Direccion || '',
        telefono: clienteSeleccinado.Telefono || '',
        email: clienteSeleccinado.Email || '',
        observaciones: clienteSeleccinado.Observaciones || '',
        vendedor: usuario?.Id,
      });
    } else {
      setFormData({
        id: codigo ?? 0,
        nombre: '',
        cuit: '',
        condicionIva: 'Consumidor Final',
        condicionFacturacion: 2,
        localidad: '',
        direccion: '',
        telefono: '',
        email: '',
        observaciones: '',
        vendedor: usuario.Id,
      });
    }
  }, [codigo, clienteSeleccinado, usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!usuario || !formData.vendedor) return;

    if (!formData.nombre.trim()) {
      mensaje('El nombre del cliente es obligatorio', 'error');
      return;
    }

    const clienteData: CreateCliente = {
      nombre: formData.nombre,
      cuit: formData.cuit,
      condicionIva: formData.condicionIva,
      condicionFacturacion: formData.condicionFacturacion,
      localidad: formData.localidad,
      direccion: formData.direccion,
      telefono: formData.telefono,
      email: formData.email,
      observaciones: formData.observaciones,
      vendedor: formData.vendedor
    }

    if (clienteSeleccinado) {
      const res = await mutateAsyncActualizar({ cliente: clienteData, id: clienteSeleccinado.Id });

      if (res) {
        mensaje('Cliente actualizado exitosamente!', 'success');
        handleClose();
      } else {
        mensaje('Error al actualizar cliente', 'error');
      }
      return;
    }


    const res = await mutateAsyncCrear(clienteData);

    if (res) {
      mensaje('Cliente cargado exitosamente!', 'success');
      handleClose();
    } else {
      mensaje('Error al cargar cliente', 'error');
    }
  };

  const handleClose = () => {
    onClose();
    setCliente(null);
  };

  if (isLoading) return;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-fade-in">
      {/* Contenedor del Modal */}
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col transform scale-100 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">{clienteSeleccinado ? 'Modificar Cliente' : 'Agregar Nuevo Cliente'}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Complete los detalles para {clienteSeleccinado ? 'modificar' : 'registrar'} un nuevo cliente.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Renglón 1: Código (corto) y Nombre (largo) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Código</label>
              <input
                type="text"
                disabled
                value={formData.id}
                placeholder="Ej: CLI-001"
                className="w-full px-3.5 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="sm:col-span-9">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Nombre / Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre completo o Razón Social"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Renglón 2: CUIT, Condición IVA, Condición Facturación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">CUIT / CUIL</label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                placeholder="20-12345678-9"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Condición IVA</label>
              <select
                value={formData.condicionIva}
                onChange={(e) => setFormData({ ...formData, condicionIva: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                <option value="Consumidor Final">Consumidor Final</option>
                <option value="Responsable Inscripto">Responsable Inscripto</option>
                <option value="Monotributo">Monotributo</option>
                <option value="Exento">Exento</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Condición Facturación</label>
              <select
                value={formData.condicionFacturacion}
                onChange={(e) => setFormData({ ...formData, condicionFacturacion: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              >
                <option value="2">Contado</option>
                <option value="1">Cuenta Corriente</option>
              </select>
            </div>
          </div>

          {/* Renglón 3: Localidad, Dirección, Teléfono, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Localidad</label>
              <input
                type="text"
                value={formData.localidad}
                onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                placeholder="Localidad"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Calle y altura"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Teléfono de contacto"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Renglón 4: Tipo de Cuenta y Observaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Observaciones</label>
              <input
                type="text"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                placeholder="Observaciones adicionales sobre el cliente..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPendingCrear || isPendingActualizar}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isPendingCrear || isPendingActualizar ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>{clienteSeleccinado ? 'Actualizar Cliente' : 'Guardar Cliente'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};