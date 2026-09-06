import { Producto } from '../../interface';

interface Props {
  item: Producto;
}

export const ProductosItem = ({ item }: Props) => {
  const stockColor =
    item.Stock <= 0
      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
      : item.Stock <= 5
      ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 border-b border-slate-200 dark:border-zinc-800/60 text-sm">
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
        {item.CodigoInterno}
      </td>
      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
        {item.CodigoBarra || <span className="text-slate-400 dark:text-zinc-600">-</span>}
      </td>
      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-zinc-100">
        <div>{item.Descripcion}</div>
        {item.CategoriaNombre && (
          <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-normal">{item.CategoriaNombre}</span>
        )}
      </td>
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stockColor}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.Stock <= 0
                ? 'bg-red-500 dark:bg-red-400 animate-pulse'
                : item.Stock <= 5
                ? 'bg-amber-500 dark:bg-amber-400'
                : 'bg-emerald-500 dark:bg-emerald-400'
            }`}
          />
          {item.Stock} u.
        </span>
      </td>
      <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
        $ {item.Precio ? item.Precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
      </td>
      <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 whitespace-nowrap">
        {item.MarcaNombre ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium border border-slate-200 dark:border-zinc-700/50">
            {item.MarcaNombre}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-zinc-600">-</span>
        )}
      </td>
      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">
        {item.cod_fabrica || <span className="text-slate-400 dark:text-zinc-600">-</span>}
      </td>
    </tr>
  );
};
