import { Provedor } from '../../interface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useProveedorStore } from '../../store';
import { useStartDeleteProveedor } from '../../hooks';
import { mensaje } from '../../helper';

interface Props {
  item: Provedor;
}

export const ProveedorItem = ({ item }: Props) => {
  const { setModalAbierto, setProveedor } = useProveedorStore();
  const { mutateAsync: eliminarProveedor } = useStartDeleteProveedor();

  const abrirModalEditar = () => {
    setProveedor(item);
    setModalAbierto(true);
  };

  const handleDelete = async () => {
    try {
      await eliminarProveedor(item.Id);
      mensaje(`Proveedor ${item.Nombre} eliminado correctamente`, 'success');
    } catch (error) {
      console.error(error);
      mensaje('Error al eliminar el proveedor', 'error');
    }
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 border-b border-slate-200 dark:border-zinc-800/60 text-sm">
      {/* ID */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
        #PRV-{item.Id.toString().padStart(2, '0')}
      </td>

      {/* Empresa / Proveedor */}
      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-zinc-100 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20 uppercase">
            {item.Nombre.slice(0, 2)}
          </div>
          <div>
            <span className="font-semibold text-sm block text-slate-900 dark:text-zinc-100">{item.Nombre}</span>
          </div>
        </div>
      </td>

      {/* Contacto */}
      <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <PersonIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{item.Contacto}</span>
        </div>
      </td>

      {/* Teléfono */}
      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
        {item.Telefono ? (
          <a
            href={`tel:${item.Telefono}`}
            className="inline-flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 font-mono transition-colors"
          >
            <PhoneIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>{item.Telefono}</span>
          </a>
        ) : (
          <span className="text-slate-400 dark:text-zinc-600 font-mono text-xs">-</span>
        )}
      </td>

      {/* Email */}
      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
        {item.Email ? (
          <a
            href={`mailto:${item.Email}`}
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <EmailIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>{item.Email}</span>
          </a>
        ) : (
          <span className="text-slate-400 dark:text-zinc-600">-</span>
        )}
      </td>

      {/* Estado */}
      <td className="py-3.5 px-4 text-center whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            item.Activo
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${item.Activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {item.Activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      {/* Acciones */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={abrirModalEditar}
            className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            title="Editar Proveedor"
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
            title="Eliminar Proveedor"
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </td>
    </tr>
  );
};
