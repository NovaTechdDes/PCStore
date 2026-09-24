import { MovimientoBackend } from '../../interface/Movimiento';

interface MovimientoItemProps {
  movimiento: MovimientoBackend;
}

export const MovimientoItem = ({ movimiento }: MovimientoItemProps) => {
  const fechaFormateada = movimiento.Fecha
    ? new Date(movimiento.Fecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '-';
  const total = (movimiento.Cantidad || 0) * (movimiento.Precio || 0);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-slate-200/60 dark:border-zinc-800/60 text-xs">
      {/* Fecha */}
      <td className="px-4 py-3 font-mono text-slate-600 dark:text-zinc-400 whitespace-nowrap">{fechaFormateada}</td>

      {/* Cod. Cliente */}
      {/* <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-zinc-300">{movimiento.cliente || '-'}</td> */}

      {/* Cliente */}
      {/* <td className="px-4 py-3 font-medium text-slate-800 dark:text-zinc-200 uppercase">{movimiento.nombreCliente || '-'}</td> */}

      {/* Tipo Comp. */}
      <td className="px-4 py-3 text-slate-600 dark:text-zinc-400 uppercase font-semibold">{movimiento.Tipo || '-'}</td>

      <td className="px-4 py-3 text-slate-600 dark:text-zinc-400 uppercase font-semibold">{movimiento.Referencia || '-'}</td>

      {/* Cantidad */}
      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 dark:text-zinc-200">{movimiento.Cantidad?.toFixed(2) ?? '0.00'}</td>

      {/* Egreso / Precio */}
      <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-zinc-300">{movimiento.Precio?.toFixed(2) ?? '0.00'}</td>

      {/* Total */}
      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">{total.toFixed(2)}</td>
    </tr>
  );
};
