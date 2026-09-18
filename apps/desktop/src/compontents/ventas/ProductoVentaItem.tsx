import DeleteIcon from '@mui/icons-material/Delete';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useVentaStore } from '../../store';
import Swal from 'sweetalert2';
import { ProductoCarrito } from '../../interface';

interface Props {
  item: ProductoCarrito;
  setIsOpenModalProducto: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductoVentaItem = ({ item, setIsOpenModalProducto }: Props) => {
  const { removeProductoCarrito, setProductoSeleccionado, agregarSerie, ventaData } = useVentaStore();

  const agregarNumeroSeries = async (item: ProductoCarrito) => {
    setProductoSeleccionado(item);

    if (!item.id) return;

    const { isConfirmed, value } = await Swal.fire({
      title: 'Ingrese el número de serie',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off',
      },
      inputValue: Array.isArray(item?.series) ? item.series.join('/n') : (item?.series ?? ''),
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });

    if (isConfirmed) agregarSerie(item.id, value || '');
  };

  return (
    <tr
      onDoubleClick={() => {
        setProductoSeleccionado(item);
        setIsOpenModalProducto(true);
      }}
      key={item.id}
      className={`cursor-pointer transition-colors ${!ventaData.facturado ? 'hover:bg-zinc-950 text-zinc-100' : 'hover:bg-slate-100/80 dark:hover:bg-zinc-800/60'}`}
    >
      <td className={`px-4 py-3 font-mono font-semibold ${!ventaData.facturado ? 'text-zinc-400' : 'text-slate-800 dark:text-zinc-300'}`}>{item.id}</td>
      <td className={`px-4 py-3 text-center font-mono font-bold ${!ventaData.facturado ? 'text-white' : 'text-slate-900 dark:text-zinc-100'}`}>{(item.cantidad || 0).toFixed(2)}</td>
      <td className={`px-6 py-3 font-semibold ${!ventaData.facturado ? 'text-white' : 'text-slate-900 dark:text-zinc-100'}`}>{item.descripcion.toUpperCase()}</td>
      <td className={`px-4 py-3 font-medium ${!ventaData.facturado ? 'text-zinc-400' : 'text-slate-600 dark:text-zinc-400'}`}>{item.marca || '-'}</td>
      <td className={`px-4 py-3 text-center font-mono font-medium ${!ventaData.facturado ? 'text-zinc-300' : 'text-slate-700 dark:text-zinc-300'}`}>%{item.impuesto == 26 ? '21.00' : '10.50'}</td>
      <td className={`px-4 py-3 text-right font-mono font-medium ${!ventaData.facturado ? 'text-zinc-200' : 'text-slate-800 dark:text-zinc-200'}`}>
        ${item.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-right font-mono font-bold text-amber-500 dark:text-amber-400">
        ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              agregarNumeroSeries(item);
            }}
            className={`p-1 rounded-lg transition-colors ${
              !ventaData.facturado
                ? 'hover:bg-zinc-900 text-zinc-400 hover:text-amber-400'
                : 'hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400'
            }`}
            title="Asignar N° de Serie"
          >
            <FormatListNumberedIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeProductoCarrito?.(item.id);
            }}
            className={`p-1 rounded-lg transition-colors ${
              !ventaData.facturado
                ? 'hover:bg-zinc-900 text-zinc-400 hover:text-red-400'
                : 'hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400'
            }`}
            title="Eliminar producto"
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </td>
    </tr>
  );
};
