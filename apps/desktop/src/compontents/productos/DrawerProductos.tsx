import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import { useProductos } from '../../hooks/useProductos';
import { useVentaStore } from '../../store';
import { Producto } from '../../interface';
import { DialogCantidad } from '../ui/DialogCantidad';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducto?: (id: string) => void;
}

export const DrawerProductos = ({ isOpen, onClose, onSelectProducto }: Props) => {
  const [busqueda, setBusqueda] = useState('');
  const [condicion, setCondicion] = useState('descripcion');

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: productos } = useProductos();

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
    <div>
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
            <h3 className="text-md font-bold text-slate-800 dark:text-zinc-100">Seleccionar Producto</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Busque y seleccione el producto para la venta.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador y Filtros */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/20 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Campo de Búsqueda */}
            <div className="relative flex-1 ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-zinc-500">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  condicion === 'codigo'
                    ? 'Buscar por código...'
                    : condicion === 'descripcion'
                      ? 'Buscar por descripción...'
                      : condicion === 'marca'
                        ? 'Buscar por marca...'
                        : 'Buscar por proveedor...'
                }
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-xs"
              />
            </div>

            {/* Selector de Condición */}
            <div className="flex flex-col items-center gap-2 shrink-0 justify-between sm:justify-start">
              <label htmlFor="condicion" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 whitespace-nowrap">
                Buscar por:
              </label>
              <div className="relative">
                <select
                  id="condicion"
                  value={condicion}
                  onChange={(e) => setCondicion(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer shadow-xs"
                >
                  <option value="codigo">Código</option>
                  <option value="descripcion">Descripción</option>
                  <option value="marca">Marca</option>
                  <option value="provedor">Proveedor</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400 dark:text-zinc-500">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Clientes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {productos && productos.length > 0 ? (
            productos.map((producto) => <ProductoItem onSelectProducto={onSelectProducto} key={producto.Id} producto={producto} />)
          ) : (
            <div className="text-center py-8 text-sm text-slate-400 dark:text-zinc-500">No se encontraron productos que coincidan.</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PropsProductosItems {
  producto: Producto;
  onSelectProducto?: (id: string) => void;
}

const ProductoItem = ({ producto, onSelectProducto }: PropsProductosItems) => {
  const { addProductoCarrito } = useVentaStore();
  const [showCantidad, setShowCantidad] = useState(false);

  const handleConfirmCantidad = (cantidad: number) => {
    addProductoCarrito({
      id: producto.Id,
      descripcion: producto.Descripcion,
      impuesto: producto.IVA,
      precio: producto.Precio,
      marca: producto.MarcaNombre || '',
      productoOriginal: producto,
      cantidad,
    });

    onSelectProducto?.(producto.Id.toString());
  };

  return (
    <div
      key={producto.Id}
      onClick={() => {
        setShowCantidad(true);
      }}
      className="p-4 border border-slate-150 dark:border-zinc-800/80 rounded-xl hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex justify-between w-full">
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md">ID: {producto.Id}</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md">Marca: {producto.MarcaNombre}</span>
          </div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200 mt-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{producto.Descripcion}</h4>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <div>
          <span className="block font-medium text-[10px] uppercase text-slate-400">Precio</span>
          <span>$ {producto.Precio.toFixed(2)}</span>
        </div>

        {producto.Stock !== undefined && (
          <div>
            <span className="block font-medium text-[10px] uppercase text-slate-400">Stock</span>
            <span>{producto.Stock.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DialogCantidad isOpen={showCantidad} onClose={() => setShowCantidad(false)} setCantidad={handleConfirmCantidad} />
      </div>
    </div>
  );
};
