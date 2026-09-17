import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useClientes } from '../../hooks/useClientes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectCliente: (id: string, nombre: string, telefono?: string, direccion?: string) => void;
}

export const DrawerClientes = ({ isOpen, onClose, onSelectCliente }: Props) => {
  const [busqueda, setBusqueda] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: clientes } = useClientes(busqueda === '' ? 'NADA' : busqueda);

  console.log(clientes);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {/* Overlay (Fondo oscuro con desenfoque) - Solo visible si isOpen es true */}
      <div
        className={`fixed inset-0 z-60 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel del Drawer - Se desliza desde la derecha */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-70 w-full max-w-md md:max-w-lg bg-white dark:bg-[#18181b] border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabecera del Drawer */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/60 dark:border-zinc-800/60">
          <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-zinc-100">Seleccionar Cliente</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Busque y seleccione el cliente para el registro.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por ID, Razón Social o CUIT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Listado de Clientes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {clientes && clientes.length > 0 ? (
            clientes.map((cliente) => (
              <div
                key={cliente._id}
                onClick={() => {
                  onSelectCliente(cliente._id, cliente.nombre, cliente?.telefono, cliente?.direccion);
                  onClose();
                }}
                className="p-4 border border-slate-150 dark:border-zinc-800/80 rounded-xl hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md">ID: {cliente._id}</span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200 mt-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{cliente.nombre}</h4>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  {cliente.cuit && (
                    <div>
                      <span className="block font-medium text-[10px] uppercase text-slate-400">CUIT</span>
                      <span>{cliente.cuit}</span>
                    </div>
                  )}
                  {cliente.telefono && (
                    <div>
                      <span className="block font-medium text-[10px] uppercase text-slate-400">Teléfono</span>
                      <span>{cliente.telefono}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-slate-400 dark:text-zinc-500">No se encontraron clientes que coincidan.</div>
          )}
        </div>
      </div>
    </>
  );
};
