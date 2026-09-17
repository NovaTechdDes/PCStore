import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { MetodoPagoDetalle, TipoMetodoPago, TipoTarjeta } from '../../interface';

import Loading from '../ui/Loading';
import { mensaje } from '../../helper/mensaje';
import { useVentaStore } from '../../store';
import { useTipoTarjetas } from '../../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  metodosPago: MetodoPagoDetalle[];
  setMetodosPago: React.Dispatch<React.SetStateAction<MetodoPagoDetalle[]>>;
  onConfirm?: () => void;
  cliente?: string;
  tipoComprobante?: string;
  domicilio?: string;
  telefono?: string;
  montoEsperado?: number;
}

export const ModalMetodosPago = ({ isOpen, onClose, metodosPago = [], setMetodosPago, onConfirm, cliente, tipoComprobante, domicilio, telefono, montoEsperado }: Props) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoMetodoPago>('efectivo');
  const { data: tiposTarjetas, isLoading } = useTipoTarjetas();
  const { productosCarrito } = useVentaStore();

  const totalFactura = montoEsperado !== undefined ? montoEsperado : productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);

  // Formulario Efectivo
  const [efectivoMonto, setEfectivoMonto] = useState<string>('');

  // Formulario Transferencia
  const [transferenciaMonto, setTransferenciaMonto] = useState<string>('');
  const [transferenciaObs, setTransferenciaObs] = useState<string>('');

  // Formulario Tarjeta
  const [tarjetaTipo, setTarjetaTipo] = useState<string>(tiposTarjetas?.tipos?.[0]._id || '');
  const [tarjetaMonto, setTarjetaMonto] = useState<string>('');
  const [tarjetaCliente, setTarjetaCliente] = useState<string>(cliente ?? '');
  const [tarjetaTipoComprobante, setTarjetaTipoComprobante] = useState<string>(tipoComprobante ?? '');

  // Formulario Cheque
  const [chequeFecha, setChequeFecha] = useState<string>('');
  const [chequeFechaVencimiento, setChequeFechaVencimiento] = useState<string>('');
  const [chequeBanco, setChequeBanco] = useState<string>('');
  const [chequeNumero, setChequeNumero] = useState<string>('');
  const [chequeMonto, setChequeMonto] = useState<string>('');
  const [chequeCliente, setChequeCliente] = useState<string>(cliente ?? '');
  const [chequeDireccion, setChequeDireccion] = useState<string>(domicilio ?? '');
  const [chequeTelefono, setChequeTelefono] = useState<string>(telefono ?? '');

  useEffect(() => {
    setTarjetaCliente(cliente ?? '');
    setTarjetaTipoComprobante(tipoComprobante ?? '');

    setChequeCliente(cliente ?? '');
    setChequeDireccion(domicilio ?? '');
    setChequeTelefono(telefono ?? '');
  }, [cliente, tipoComprobante, domicilio, telefono]);

  useEffect(() => {
    setTarjetaTipo(tiposTarjetas?.tipos?.[0]._id || '');
  }, [tiposTarjetas]);

  if (!isOpen) return null;
  const handleAgregarMetodo = () => {
    if (tipoSeleccionado === 'efectivo') {
      const monto = Number(efectivoMonto);
      if (!monto || monto <= 0) return;
      setMetodosPago((prev) => [...prev, { tipo: 'efectivo', monto }]);
      setEfectivoMonto('');
    } else if (tipoSeleccionado === 'transferencia') {
      const monto = Number(transferenciaMonto);
      if (!monto || monto <= 0) return;
      setMetodosPago((prev) => [...prev, { tipo: 'transferencia', monto, observacion: transferenciaObs }]);
      setTransferenciaMonto('');
      setTransferenciaObs('');
    } else if (tipoSeleccionado === 'tarjeta') {
      const monto = Number(tarjetaMonto);
      if (!monto || monto <= 0) return;
      setMetodosPago((prev) => [
        ...prev,
        {
          tipo: 'tarjeta',
          tarjeta: tarjetaTipo,
          monto,
          cliente: tarjetaCliente,
          tipoComprobante: tarjetaTipoComprobante,
        },
      ]);
      setTarjetaMonto('');
      setTarjetaCliente('');
      setTarjetaTipoComprobante('');
    } else if (tipoSeleccionado === 'cheque') {
      const monto = Number(chequeMonto);
      if (!monto || monto <= 0) return;
      setMetodosPago((prev) => [
        ...prev,
        {
          tipo: 'cheque',
          fecha: chequeFecha,
          fechaVencimiento: chequeFechaVencimiento,
          banco: chequeBanco,
          numero: chequeNumero,
          monto,
          cliente: chequeCliente,
          direccion: chequeDireccion,
          telefono: chequeTelefono,
        },
      ]);
      setChequeFecha('');
      setChequeFechaVencimiento('');
      setChequeBanco('');
      setChequeNumero('');
      setChequeMonto('');
      setChequeCliente('');
      setChequeDireccion('');
      setChequeTelefono('');
    }
  };

  const handleEliminarMetodo = (index: number) => {
    setMetodosPago((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return metodosPago.reduce((acc, item) => {
      if (item.tipo === 'cheque') return acc + item.monto;
      return acc + item.monto;
    }, 0);
  };

  const handleConfirmar = () => {
    if ((totalFactura || 0) > 0 && metodosPago.length === 0) {
      mensaje('Debe de cargar algun metodo de pago', 'error');
      return;
    }
    onConfirm?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PaymentsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">Métodos de Pago</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Agregue y combine múltiples formas de pago para el recibo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Pestañas de selección de método */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">Seleccionar Método a Agregar</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTipoSeleccionado('efectivo')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  tipoSeleccionado === 'efectivo'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                <AccountBalanceWalletIcon className="w-4 h-4" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoSeleccionado('transferencia')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  tipoSeleccionado === 'transferencia'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                <AccountBalanceIcon className="w-4 h-4" />
                <span>Transferencia</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoSeleccionado('tarjeta')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  tipoSeleccionado === 'tarjeta'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                <CreditCardIcon className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoSeleccionado('cheque')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  tipoSeleccionado === 'cheque'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                <ConfirmationNumberIcon className="w-4 h-4" />
                <span>Cheque</span>
              </button>
            </div>
          </div>

          {/* Campos dinámicos según el método seleccionado */}
          <div className="p-4 bg-slate-50/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-3">
            {tipoSeleccionado === 'efectivo' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Monto en Efectivo ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={efectivoMonto}
                  onChange={(e) => setEfectivoMonto(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            )}

            {tipoSeleccionado === 'transferencia' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Monto Transferencia ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transferenciaMonto}
                    onChange={(e) => setTransferenciaMonto(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Observación</label>
                  <input
                    type="text"
                    value={transferenciaObs}
                    onChange={(e) => setTransferenciaObs(e.target.value)}
                    placeholder="Ej: Nro de operación / CBU"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {isLoading ? (
              <Loading text="Cargando Tipos de Tarjetas" />
            ) : (
              tipoSeleccionado === 'tarjeta' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Tipo de Tarjeta</label>
                    <select
                      value={tarjetaTipo}
                      onChange={(e) => setTarjetaTipo(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      {tiposTarjetas?.tipos?.map((t: TipoTarjeta) => (
                        <option key={t.Id} value={t.Id}>
                          {t.Nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Monto ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={tarjetaMonto}
                      onChange={(e) => setTarjetaMonto(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={tarjetaCliente}
                      onChange={(e) => setTarjetaCliente(e.target.value)}
                      placeholder="Nombre del titular / cliente"
                      className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Tipo Comprobante</label>
                    <input
                      type="text"
                      value={tarjetaTipoComprobante}
                      onChange={(e) => setTarjetaTipoComprobante(e.target.value)}
                      placeholder="Ej: Voucher N° / Recibo"
                      className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              )
            )}

            {tipoSeleccionado === 'cheque' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={chequeFecha}
                    onChange={(e) => setChequeFecha(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={chequeFechaVencimiento}
                    onChange={(e) => setChequeFechaVencimiento(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Banco</label>
                  <input
                    type="text"
                    value={chequeBanco}
                    onChange={(e) => setChequeBanco(e.target.value)}
                    placeholder="Ej: Banco Galicia"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Número de Cheque</label>
                  <input
                    type="text"
                    value={chequeNumero}
                    onChange={(e) => setChequeNumero(e.target.value)}
                    placeholder="N° de cheque"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Monto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={chequeMonto}
                    onChange={(e) => setChequeMonto(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-[#18181b] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={chequeCliente}
                    onChange={(e) => setChequeCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={chequeDireccion}
                    onChange={(e) => setChequeDireccion(e.target.value)}
                    placeholder="Dirección"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={chequeTelefono}
                    onChange={(e) => setChequeTelefono(e.target.value)}
                    placeholder="Teléfono de contacto"
                    className="w-full px-3 py-2 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 dark:placeholder-zinc-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAgregarMetodo}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
            >
              <AddCircleIcon className="w-4 h-4" />
              <span>Agregar {tipoSeleccionado.toUpperCase()}</span>
            </button>
          </div>

          {/* Lista de Métodos Agregados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Métodos Combinados Agregados</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {metodosPago.length} pago{metodosPago.length !== 1 ? 's' : ''}
              </span>
            </div>

            {metodosPago.length > 0 ? (
              <div className="space-y-2">
                {metodosPago.map((item, idx) => {
                  const montoItem = item.tipo === 'cheque' ? item.monto : item.monto;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-bold text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">{item.tipo}</span>
                          {item.tipo === 'tarjeta' && (
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                              ({item.tarjeta} - {item.cliente || 'Sin cliente'})
                            </span>
                          )}
                          {item.tipo === 'cheque' && (
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                              ({item.banco} N° {item.numero} - {item.cliente})
                            </span>
                          )}
                        </div>
                        {item.tipo === 'transferencia' && item.observacion && <p className="text-xs text-slate-400 dark:text-zinc-500 italic">Obs: {item.observacion}</p>}
                        {item.tipo === 'cheque' && (
                          <p className="text-xs text-slate-400 dark:text-zinc-500">
                            F. Emisión: {item.fecha} | F. Venc: {item.fechaVencimiento} | Tel: {item.telefono}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">${montoItem?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        <button
                          type="button"
                          onClick={() => handleEliminarMetodo(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Eliminar método"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-zinc-500 italic">No hay métodos de pago agregados aún.</div>
            )}
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/30">
          <div>
            <span className="text-xs text-slate-500 dark:text-zinc-400">Total Combinado:</span>
            <span className={`ml-2 text-base font-mono font-bold ${calcularTotal() < totalFactura ? 'text-red-500' : 'text-green-500'}`}>
              ${calcularTotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-zinc-400">{tipoComprobante === 'Recibo' ? 'Total a Cobrar:' : 'Total Factura:'}</span>
            <span className="ml-2 text-base font-mono font-bold text-slate-800 dark:text-zinc-100">${totalFactura.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
