import { useState } from 'react';
import { Cabecera, ClienteItem, Loading, ModalCliente } from '../compontents';
import { useClientes } from '../hooks';
import { useClienteStore } from '../store';

export const Clientes = () => {
  const [desactivados, setDescativados] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { buscadorCliente, setBuscadorCliente, setCliente } = useClienteStore();
  const { data: clientes, isLoading } = useClientes(buscadorCliente);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabecera, buscador y filtros */}

      <Cabecera
        titulo="Clientes"
        descripcion="Gestión de clientes"
        textoBoton="Agregar Cliente"
        funcion={() => {
          setCliente(null);
          setShowModal(true);
        }}
        buscador={buscadorCliente}
        setBuscador={setBuscadorCliente}
      >
        <label
          htmlFor="clientesDesactivados"
          className="inline-flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-all text-slate-700 dark:text-zinc-300 font-medium text-sm w-full sm:w-auto"
        >
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 whitespace-nowrap">Ver Desactivados</span>
          <div className="relative inline-flex items-center">
            <input id="clientesDesactivados" type="checkbox" checked={desactivados} onChange={() => setDescativados(!desactivados)} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500"></div>
          </div>
        </label>
      </Cabecera>

      {/* Listado / tabla */}

      {isLoading ? (
        <Loading text="Cargando clientes..." />
      ) : (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden">
          <div className="overflow-auto h-[60vh]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/90 dark:bg-zinc-900/60">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Codigo</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Nombre</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Cuit</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Saldo</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">telefono</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Direccion</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Iva</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80">
                {clientes?.map((cliente) => (
                  <ClienteItem key={cliente.Id} cliente={cliente} editar={setShowModal} />
                ))}
              </tbody>
            </table>
          </div>

          {clientes?.length === 0 && <div className="p-8 h-[2vh] flex items-center justify-center text-center text-sm font-medium text-slate-500 dark:text-zinc-400">No se encontraron Clientes</div>}
        </div>
      )}
      {showModal && <ModalCliente onClose={() => setShowModal(false)} />}
    </div>
  );
};