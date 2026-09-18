import PrintIcon from '@mui/icons-material/Print';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PercentIcon from '@mui/icons-material/Percent';
import { useEffect, useState } from 'react';
import { useVentaStore } from '../../store';

type TipoVenta = 'Remito' | 'Presupuesto' | 'Contado' | 'CuentaCorriente';

interface FooterVentaProps {
  clienteId?: string;
  condicionFacturacion?: number;
  facturado: boolean;
  onCancelar?: () => void;
  onFacturar?: () => void;
}

export const FooterVenta = ({ clienteId = '1', condicionFacturacion = 1, facturado, onCancelar, onFacturar }: FooterVentaProps) => {
  const { productosCarrito, ventaData, setVentaData } = useVentaStore();

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let total = 0;
    productosCarrito.forEach((producto) => {
      total += producto.precio * producto.cantidad;
    });
    setTotal(total);
    setVentaData({
      ...ventaData,
      descuento: 0,
    });
  }, [productosCarrito]);

  useEffect(() => {
    let total = 0;
    productosCarrito.forEach((producto) => {
      total += producto.precio * producto.cantidad;
    });

    const descuentoCalculado = (total * ventaData.descuento) / 100;
    const totalConDescuento = total - descuentoCalculado;
    setTotal(totalConDescuento);
  }, [ventaData.descuento]);

  const handleTipoChange = (val: TipoVenta) => {
    

    if (val === 'Contado') {
      setVentaData({
        ...ventaData,
        tipoPago: 'CD',
        tipoVenta: val,
      });
    }
    if (val === 'CuentaCorriente') {
      setVentaData({
        ...ventaData,
        tipoPago: 'CC',
        tipoVenta: val,
      });
    }
    if (val === 'Remito') {
      setVentaData({
        ...ventaData,
        tipoPago: 'RT',
        tipoVenta: val,
      });
    }
    if (val === 'Presupuesto') {
      setVentaData({
        ...ventaData,
        tipoPago: 'PP',
        tipoVenta: val,
      });
    }
  };

  const handleImpresionChange = (val: boolean) => {
    setVentaData({
      ...ventaData,
      impresion: val,
    });
  };

  const handleDolarChange = (val: boolean) => {
    setVentaData({
      ...ventaData,
      dolar: val,
    });
  };

  const opcionesTipo: { id: TipoVenta; label: string }[] = [
    { id: 'Remito', label: 'Remito' },
    { id: 'Presupuesto', label: 'Presupuesto' },
    { id: 'Contado', label: 'Contado' },
    { id: 'CuentaCorriente', label: 'Cuenta Corriente' },
  ];

  const opcionesDisponibles = opcionesTipo.filter((opcion) => {
    if ((clienteId === '1' && opcion.id === 'Remito') || (opcion.id === 'Remito' && facturado)) {
      return false;
    }
    if (condicionFacturacion !== 1 && opcion.id === 'CuentaCorriente') {
      return false;
    }
    return true;
  });

  return (
    <footer
      className={`rounded-b-2xl border p-5 shadow-xs space-y-5 transition-colors ${
        !facturado ? 'bg-black border-zinc-800 text-white' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800'
      }`}
    >
      {/* Fila Superior: Tipo de Comprobante & Total */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b ${!facturado ? 'border-zinc-800' : 'border-slate-200 dark:border-zinc-800'}`}>
        {/* Selector tipo de venta */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className={`text-[11px] font-bold uppercase tracking-wider mr-1 ${!facturado ? 'text-zinc-400' : 'text-slate-700 dark:text-zinc-400'}`}>Tipo de Venta:</span>
          <div
            className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border ${
              !facturado ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'
            }`}
          >
            {opcionesDisponibles.map((opt) => {
              const isSelected = ventaData.tipoVenta === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 select-none ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs font-bold'
                      : !facturado
                        ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                        : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/70 dark:hover:bg-zinc-800'
                  }`}
                >
                  <input type="radio" name="tipoVenta" value={opt.id} checked={isSelected} onChange={() => handleTipoChange(opt.id)} className="sr-only" />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Display Total */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label htmlFor="total-venta" className={`text-xs font-bold uppercase tracking-wider ${!facturado ? 'text-zinc-300' : 'text-slate-700 dark:text-zinc-300'}`}>
            Total
          </label>
          <div className="relative min-w-44">
            <AttachMoneyIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold w-5 h-5" />
            <input
              type="text"
              id="total-venta"
              name="total"
              readOnly
              value={typeof total === 'number' ? total.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : total}
              className={`w-full pl-9 pr-4 py-2.5 font-black rounded-xl text-lg text-right font-mono focus:outline-none select-none border ${
                !facturado ? 'bg-zinc-950 border-amber-500/50 text-amber-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Fila Inferior: Impresión/Dólar, Botones de Acción, Descuento */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Opciones Impresión & Dólar */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Impresión (F6) */}
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={ventaData.impresion}
              onChange={(e) => handleImpresionChange(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 dark:border-zinc-700 focus:ring-amber-500/20 cursor-pointer"
            />
            <span className={`text-xs font-semibold flex items-center gap-1 ${!facturado ? 'text-zinc-200' : 'text-slate-800 dark:text-zinc-200'}`}>
              <PrintIcon className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" />
              <span>Impresión</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                  !facturado ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                }`}
              >
                F6
              </span>
            </span>
          </label>

          {/* Dólar (F7) */}
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={ventaData.dolar}
              onChange={(e) => handleDolarChange(e.target.checked)}
              className="w-4 h-4 text-amber-500 rounded border-slate-300 dark:border-zinc-700 focus:ring-amber-500/20 cursor-pointer"
            />
            <span className={`text-xs font-semibold flex items-center gap-1 ${!facturado ? 'text-zinc-200' : 'text-slate-800 dark:text-zinc-200'}`}>
              <CurrencyExchangeIcon className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" />
              <span>Dólar</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                  !facturado ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                }`}
              >
                F7
              </span>
            </span>
          </label>
        </div>

        {/* Botones de Acción principales */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={onCancelar}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer border ${
              !facturado
                ? 'bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-800'
                : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'
            }`}
          >
            <CancelIcon className="w-4 h-4 text-slate-500" />
            <span>Cancelar</span>
          </button>

          <button
            type="button"
            onClick={onFacturar}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer ${
              ventaData.esNotaCredito ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'
            }`}
          >
            <ReceiptIcon className="w-4 h-4" />
            <span>{ventaData.esNotaCredito ? 'Emitir Nota de Crédito' : 'Facturar'}</span>
          </button>
        </div>

        {/* Porcentaje de Descuento */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <label htmlFor="descuento-venta" className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${!facturado ? 'text-zinc-400' : 'text-slate-700 dark:text-zinc-400'}`}>
            % Descuento
          </label>
          <div className="relative w-28">
            <PercentIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${!facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`} />
            <input
              type="text"
              id="descuento-venta"
              name="descuento"
              placeholder="0.00"
              value={ventaData.descuento}
              onChange={(e) => setVentaData({ ...ventaData, descuento: parseInt(e.target.value) })}
              className={`w-full pl-8 pr-3 py-2 border rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-right ${
                !facturado ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600' : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100'
              }`}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
