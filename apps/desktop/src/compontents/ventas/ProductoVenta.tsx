import { useEffect, useRef, useState } from 'react';
import { useDatos } from '../../hooks/useDatos';
import { useVentaStore } from '../../store';
import { ModalModificarProducto } from './ModalModificarProducto';

import Loading from '../ui/Loading';

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useProductoByCodigoBarras } from '../../hooks';
import { ProductoVentaItem } from './ProductoVentaItem';

interface Props {
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  codigo: string;
  setCodigo: React.Dispatch<React.SetStateAction<string>>;
}

export const ProductoVenta = ({ setIsDrawerOpen, codigo, setCodigo }: Props) => {
  const { data: datos, isLoading: isLoadingDatos } = useDatos();
  const { productosCarrito, addProductoCarrito, ventaData } = useVentaStore();

  const [descripcion, setDescripcion] = useState<string>('');
  const [iva, setIva] = useState<number>(21);
  const [precioU, setPrecioU] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);

  const [precioUInput, setPrecioUInput] = useState<string>('0');

  const codigoInputRef = useRef<HTMLInputElement>(null);
  const cantidadInputRef = useRef<HTMLInputElement>(null);
  const descripcionInputRef = useRef<HTMLInputElement>(null);
  const ivaInputRef = useRef<HTMLSelectElement>(null);
  const precioInputRef = useRef<HTMLInputElement>(null);
  const agregarButtonRef = useRef<HTMLButtonElement>(null);

  //Modal Producto
  const [isOpenModalProducto, setIsOpenModalProducto] = useState<boolean>(false);

  const { data: producto, isLoading } = useProductoByCodigoBarras(codigo);

  useEffect(() => {
    if (producto) {
      const precio = producto.Precio;

      setDescripcion(producto.descripcion);
      setIva(producto.impuesto);
      setPrecioU(precio);
      setPrecioUInput(precio.toString());
    } else {
      setDescripcion('');
      setIva(21);
      setPrecioU(0);
      setPrecioUInput('0');
    }
  }, [producto, datos]);

  const handleAddProduct = () => {
    addProductoCarrito({
      _id: codigo,
      cantidad,
      descripcion,
      impuesto: iva,
      marca: producto?.marca?.nombre || '',
      precio: precioU,
      productoOriginal: producto || undefined,
      codigoAux: codigo === '' ? ventaData.codigoAux : '',
    });

    setCodigo('');
    setDescripcion('');
    setCantidad(1);
    setPrecioU(0);
    setIva(21);
  };

  const handleCantidadKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (producto) {
        addProductoCarrito({
          _id: producto._id,
          descripcion,
          cantidad: Number(e.currentTarget.value),
          impuesto: iva,
          marca: producto.marca?.nombre || '',
          precio: precioU,
          productoOriginal: producto,
        });
        setDescripcion('');
        setCantidad(1);
        setPrecioU(0);
        setCodigo('');
        setIva(21);
        codigoInputRef.current?.focus();
      } else {
        descripcionInputRef.current?.focus();
      }
    }
  };

  const inputClass = !ventaData.facturado
    ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:ring-amber-500/20'
    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:ring-amber-500/20';

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1 ${!ventaData.facturado ? 'text-zinc-400' : 'text-slate-700 dark:text-zinc-400'}`;

  return (
    <section className="flex-1 min-h-75 flex flex-col gap-4">
      {/* Buscador de productos (Oculto en modo Nota de Crédito) */}
      {!ventaData.esNotaCredito && (
        <div
          className={`rounded-b-2xl border p-4 shadow-xs shrink-0 relative overflow-hidden transition-colors ${
            !ventaData.facturado ? 'bg-black border-zinc-800 text-white' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800'
          }`}
        >
          {isLoading ||
            (isLoadingDatos && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-[1px]">
                <Loading size="sm" text="Cargando producto..." />
              </div>
            ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end">
            {/* Código / Cod-Barras */}
            <div className="col-span-12 sm:col-span-6 md:col-span-2">
              <label htmlFor="prod-codigo" className={labelClass}>
                Código
              </label>
              <div className="relative">
                <QrCodeScannerIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${!ventaData.facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`} />
                <input
                  type="text"
                  id="prod-codigo"
                  placeholder="Cod. Barras"
                  ref={codigoInputRef}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!codigo.trim()) {
                        e.preventDefault();
                        setIsDrawerOpen(true);
                      } else {
                        cantidadInputRef.current?.focus();
                        cantidadInputRef.current?.select();
                      }
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 transition-all ${inputClass}`}
                />
              </div>
            </div>

            {/* Cantidad */}
            <div className="col-span-12 sm:col-span-6 md:col-span-1">
              <label htmlFor="prod-cantidad" className={labelClass}>
                Cantidad
              </label>
              <input
                type="number"
                id="prod-cantidad"
                value={cantidad === 0 ? '' : cantidad}
                ref={cantidadInputRef}
                onKeyDown={handleCantidadKeyDown}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold text-center focus:outline-none focus:ring-2 transition-all ${inputClass}`}
              />
            </div>

            {/* Descripción */}
            <div className="col-span-12 sm:col-span-12 md:col-span-5">
              <label htmlFor="prod-descripcion" className={labelClass}>
                Descripción
              </label>
              <div className="relative">
                <ShoppingBagIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${!ventaData.facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`} />
                <input
                  type="text"
                  ref={descripcionInputRef}
                  id="prod-descripcion"
                  placeholder="Buscar por descripción del producto..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      ivaInputRef.current?.focus();
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 transition-all ${inputClass}`}
                />
              </div>
            </div>

            {/* IVA */}
            <div className="col-span-12 sm:col-span-6 md:col-span-2">
              <label htmlFor="prod-iva" className={labelClass}>
                IVA
              </label>
              <div className="relative">
                <PercentIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${!ventaData.facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`} />
                <select
                  id="prod-iva"
                  ref={ivaInputRef}
                  value={iva}
                  onChange={(e) => setIva(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      precioInputRef.current?.focus();
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${inputClass}`}
                >
                  <option value="21">% 21.00</option>
                  <option value="10.5">% 10.50</option>
                  <option value="0">% 0.00</option>
                </select>
              </div>
            </div>

            {/* Precio-U */}
            <div className="col-span-12 sm:col-span-6 md:col-span-2 flex gap-2">
              <div className="flex-1">
                <label htmlFor="prod-preciou" className={labelClass}>
                  Precio-U
                </label>
                <div className="relative">
                  <AttachMoneyIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 w-3.5 h-3.5" />
                  <input
                    type="text"
                    id="prod-preciou"
                    ref={precioInputRef}
                    placeholder="0.00"
                    value={precioUInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrecioUInput(val);
                      const num = parseFloat(val.replace(',', '.'));
                      setPrecioU(isNaN(num) ? 0 : num);
                    }}
                    className={`w-full pl-8 pr-3 py-2 border font-bold rounded-xl text-xs font-mono focus:outline-none ${
                      !ventaData.facturado ? 'bg-zinc-950 border-amber-500/40 text-amber-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                ref={agregarButtonRef}
                type="button"
                className="mt-auto px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                title="Agregar Producto"
              >
                <AddShoppingCartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Productos */}
      <div
        className={`rounded-t-2xl border shadow-xs overflow-hidden flex-1 min-h-0 flex flex-col transition-colors ${
          !ventaData.facturado ? 'bg-black border-zinc-800' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800'
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr
                className={`border-b uppercase text-[11px] font-bold tracking-wider ${
                  !ventaData.facturado ? 'border-zinc-800 bg-zinc-950 text-zinc-300' : 'border-slate-200 dark:border-zinc-800 bg-slate-100/95 dark:bg-zinc-900/95 text-slate-700 dark:text-zinc-300'
                }`}
              >
                <th className="px-4 py-3">Cod-Barras</th>
                <th className="px-4 py-3 text-center">Cantidad</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3 text-center">IVA</th>
                <th className="px-4 py-3 text-right">Precio-U</th>
                <th className="px-4 py-3 text-right">Precio-T</th>
                <th className="px-4 py-3 text-center w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${!ventaData.facturado ? 'divide-zinc-800/80 bg-black' : 'divide-slate-200 dark:divide-zinc-800/80'}`}>
              {productosCarrito.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ProductionQuantityLimitsIcon className="w-10 h-10 text-slate-300 dark:text-zinc-600" />
                      <p className={`font-bold ${!ventaData.facturado ? 'text-zinc-200' : 'text-slate-700 dark:text-zinc-300'}`}>No hay productos agregados a la venta.</p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Ingresa un código o descripción para comenzar a sumar artículos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                productosCarrito.map((item) => <ProductoVentaItem key={item._id ? item._id : item.codigoAux} item={item} setIsOpenModalProducto={setIsOpenModalProducto} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para modificar producto */}
      {/* <ModalModificarProducto isOpen={isOpenModalProducto} onClose={() => setIsOpenModalProducto(false)} /> */}
    </section>
  );
};
