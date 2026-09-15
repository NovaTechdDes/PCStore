import { useState, useMemo } from 'react';
import { Cabecera, Loading, ModalProveedor, ProveedorItem } from '../compontents';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useProveedores } from '../hooks';
import { useProveedorStore } from '../store';

export const ProveedorScreen = () => {
  const { setProveedor, setModalAbierto, modalAbierto } = useProveedorStore();
  const [buscador, setBuscador] = useState('');

  const { data: proveedores, isLoading } = useProveedores();

  const abrirModalCrear = () => {
    setProveedor(null);
    setModalAbierto(true);
  };

  // Filtrado reactivo de proveedores
  const proveedoresFiltrados = useMemo(() => {
    if (!buscador.trim()) return proveedores || [];
    const query = buscador.toLowerCase();
    return proveedores?.filter(
      (p) =>
        p.Nombre.toLowerCase().includes(query) ||
        p.Contacto.toLowerCase().includes(query) ||
        (p.Email && p.Email.toLowerCase().includes(query)) ||
        (p.Telefono && p.Telefono.toLowerCase().includes(query))
    );
  }, [proveedores, buscador]);

  // Cálculos de métricas
  const totalProveedores = proveedores?.length || 0;
  const proveedoresActivos = proveedores?.filter((p) => p.Activo).length || 0;
  const proveedoresConContacto = proveedores?.filter((p) => p.Telefono || p.Email).length || 0;

  if (isLoading) return <Loading text="Cargando Proveedores..." />;

  return (
    <div className="h-[calc(100vh-50px)] bg-slate-50 dark:bg-zinc-950 p-6 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Cabecera superior con buscador */}
      <Cabecera
        titulo="Gestión de Proveedores"
        descripcion="Administra tus distribuidores, contactos comerciales, números de teléfono y correos"
        textoBoton="Nuevo Proveedor"
        funcion={abrirModalCrear}
        buscador={buscador}
        setBuscador={setBuscador}
      />

      {/* Tarjetas de Métricas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <LocalShippingIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Proveedores
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{totalProveedores}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Proveedores Activos
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{proveedoresActivos}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <ContactPhoneIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Con Datos de Contacto
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{proveedoresConContacto}</div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la Tabla de Proveedores */}
      <div className="relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden backdrop-blur-xs transition-colors duration-200">
        <div className="overflow-x-auto h-[45vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-24">ID</th>
                <th className="py-3.5 px-4">Empresa / Proveedor</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
              {proveedores && proveedoresFiltrados && proveedoresFiltrados.length > 0 ? (
                proveedoresFiltrados.map((item) => <ProveedorItem key={item.Id} item={item} />)
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-medium text-slate-700 dark:text-zinc-300">
                        No se encontraron proveedores
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
                        {buscador ? 'Prueba con otros términos de búsqueda' : 'No hay proveedores registrados en el sistema'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla con contador */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Mostrando {proveedoresFiltrados?.length || 0} de {totalProveedores} proveedores
          </span>
          <span>Red de Distribuidores</span>
        </div>
      </div>

      {/* MODAL / FORMULARIO PARA AGREGAR O EDITAR PROVEEDOR */}
      {modalAbierto && <ModalProveedor />}
    </div>
  );
};
