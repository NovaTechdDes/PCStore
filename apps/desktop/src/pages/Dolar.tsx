import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useDolar, useActualizarDolar } from '../hooks';
import { useGlobalStore } from '../store';
import { Loading } from '../compontents';
import { mensaje } from '../helper/mensaje';

export const Dolar: React.FC = () => {
  const navigate = useNavigate();
  const globalDolar = useGlobalStore((state) => state.dolar);
  const { data: dolarData, isLoading, refetch, isFetching } = useDolar();
  const { mutateAsync: actualizarDolarMutate, isPending } = useActualizarDolar();

  const [valorInput, setValorInput] = useState<string>('');
  const [errorInput, setErrorInput] = useState<string | null>(null);

  // Valor actual persistido/obtenido
  const valorActual = dolarData?.Valor ?? (globalDolar > 0 ? globalDolar : 0);

  useEffect(() => {
    if (dolarData?.Valor !== undefined) {
      setValorInput(String(dolarData.Valor));
    } else if (globalDolar) {
      setValorInput(String(globalDolar));
    }
  }, [dolarData, globalDolar]);

  const nuevoValorNum = parseFloat(valorInput) || 0;
  const diferencia = nuevoValorNum - valorActual;
  const porcentajeCambio = valorActual > 0 ? ((diferencia / valorActual) * 100).toFixed(2) : '0';
  const hayCambios = nuevoValorNum > 0 && Math.abs(nuevoValorNum - valorActual) > 0.0001;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValorInput(val);
    const num = parseFloat(val);
    if (!val.trim()) {
      setErrorInput('El valor no puede estar vacío');
    } else if (isNaN(num) || num <= 0) {
      setErrorInput('El valor debe ser un número mayor a 0');
    } else {
      setErrorInput(null);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errorInput || nuevoValorNum <= 0) {
      mensaje('Por favor ingresa una cotización válida', 'warning');
      return;
    }

    if (!hayCambios) {
      mensaje('La cotización no ha sufrido cambios', 'info');
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: '¿Confirmar actualización?',
      html: `
        <div class="text-left text-sm space-y-2 mt-2">
          <p>La cotización pasará de <strong class="text-amber-500 font-bold">$${valorActual.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong> a <strong class="text-emerald-500 font-bold">$${nuevoValorNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>.</p>
          <p class="text-xs text-slate-500">Esto recalculará automáticamente los costos y precios de venta de todos los productos cotizados en moneda extranjera.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar precios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#71717a',
    });

    if (!isConfirmed) return;

    try {
      const res = await actualizarDolarMutate(nuevoValorNum);
      if (res.ok) {
        mensaje('Cotización actualizada exitosamente', 'success');
      } else {
        mensaje(res.msg || 'Error al actualizar cotización', 'error');
      }
    } catch {
      mensaje('Error al conectar con el servidor', 'error');
    }
  };

  const handleReset = () => {
    setValorInput(String(valorActual));
    setErrorInput(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loading text="Cargando cotización del dólar..." />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Banner / Cabecera */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
            <AttachMoneyIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                Cotización del Dólar
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Oficial Sistema
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1">
              Configura el tipo de cambio base utilizado para calcular los precios de venta y costos de los productos en dólares.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Refrescar cotización"
          >
            <RefreshRoundedIcon className={`w-4 h-4 ${isFetching ? 'animate-spin text-amber-500' : ''}`} />
            <span>Refrescar</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowBackRoundedIcon className="w-4 h-4" />
            <span>Volver</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Formulario de Modificación */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleGuardar}
            className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-6"
          >
            <div className="border-b border-slate-100 dark:border-zinc-800/80 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Actualizar Cotización
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Ingresa el nuevo importe de cambio para aplicar en todas las listas de precios activas.
              </p>
            </div>

            {/* Input con prefijo monetario */}
            <div className="space-y-2">
              <label htmlFor="dolar" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                Nuevo Valor del Dólar (ARS) <span className="text-amber-500">*</span>
              </label>

              <div className="relative rounded-2xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-zinc-500 font-bold text-lg">
                  $
                </div>
                <input
                  type="number"
                  name="dolar"
                  id="dolar"
                  step="0.01"
                  min="0.01"
                  autoFocus
                  placeholder="0.00"
                  value={valorInput}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border bg-slate-50 dark:bg-zinc-900/80 py-3.5 pl-9 pr-14 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 outline-none transition-all placeholder:text-slate-400 focus:bg-white dark:focus:bg-zinc-900 ${
                    errorInput
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-slate-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15'
                  }`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    ARS
                  </span>
                </div>
              </div>

              {errorInput ? (
                <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 mt-1.5">
                  <WarningAmberRoundedIcon className="w-4 h-4" />
                  {errorInput}
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Usa punto o coma para decimales (ejemplo: 1250.50).
                </p>
              )}
            </div>

            {/* Simulación de impacto rápido si hay cambios */}
            {hayCambios && !errorInput && (
              <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-zinc-300">Variación estimada:</span>
                  <span
                    className={`font-black flex items-center gap-1 ${
                      diferencia > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <TrendingUpIcon className={`w-4 h-4 ${diferencia < 0 ? 'rotate-180' : ''}`} />
                    {diferencia > 0 ? '+' : ''}
                    {diferencia.toFixed(2)} ARS ({porcentajeCambio}%)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Un producto valuado en <strong className="text-slate-700 dark:text-zinc-200">USD 100.00</strong> pasará de costar{' '}
                  <span className="line-through">${(valorActual * 100).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span> a costar{' '}
                  <strong className="text-amber-600 dark:text-amber-400 font-bold">
                    ${(nuevoValorNum * 100).toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                  </strong>
                  .
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={handleReset}
                disabled={!hayCambios || isPending}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Reestablecer
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Salir
              </button>

              <button
                type="submit"
                disabled={!hayCambios || !!errorInput || isPending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <SaveRoundedIcon className="w-4 h-4" />
                    <span>Actualizar Dólar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Tarjeta de Cotización Actual e Información */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Cotización Actual */}
          <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Cotización Vigente
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircleOutlineRoundedIcon className="w-3.5 h-3.5" />
                En uso
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-slate-400 dark:text-zinc-500">$</span>
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                {valorActual.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ARS</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Equivalente de 1 USD a moneda local (Pesos Argentinos).
            </p>
          </div>

          {/* Información y Recomendaciones */}
          <div className="bg-amber-500/5 dark:bg-zinc-900/60 border border-amber-500/20 dark:border-zinc-800 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <InfoOutlinedIcon className="w-4 h-4" />
              <span>Importante sobre este ajuste</span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Recálculo Automático:</strong> Los productos cargados con costo en dólares actualizarán su precio de venta en ARS al instante según su margen de ganancia e IVA.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Ventas y Presupuestos:</strong> Las ventas ya registradas mantendrán los importes históricos. Los nuevos presupuestos se generarán con este valor.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Sincronización:</strong> El nuevo valor se propaga automáticamente a todos los módulos y pantallas sin necesidad de reiniciar la aplicación.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dolar;
