import { ClienteBackEnd } from '../../interface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { mensaje } from '../../helper/mensaje';
import Swal from 'sweetalert2';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useClienteStore, useGlobalStore } from '../../store';
import { useStartActivateCliente, useStartDeleteCliente } from '../../hooks';

interface Props {
    cliente: ClienteBackEnd;
    editar: (show: boolean) => void;
}

export const ClienteItem = ({cliente, editar}: Props) => {
  const { usuario } = useGlobalStore();
  const { setCliente } = useClienteStore();
  const { mutateAsync: desactivarcliente, isPending } = useStartDeleteCliente();
  const { mutateAsync: activarCliente, isPending: isPendingActivar } = useStartActivateCliente();

  const handleEdit = async() => {
    editar(true);
    setCliente(cliente);
  }

  const handleDelete = async() => {

    const { isConfirmed } = await Swal.fire({
      title: '¿Está seguro de desactivar el cliente?',
      text: 'El cliente pasará al listado de desactivados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d'
    })

    if(!isConfirmed) return;

    const res = await desactivarcliente(cliente.Id);

    if(res){
      mensaje('Cliente desactivado correctamente', 'success')
    }else{
      mensaje('Error al desactivar el cliente', 'error')
    }
  };

  const handleActivar = async() => {
    const {isConfirmed} = await Swal.fire({
      title: '¿Está seguro de activar el cliente?',
      text: 'El cliente volverá al listado activo',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#6c757d'
    })

    if(!isConfirmed) return;

    const res = await activarCliente(cliente.Id);

    if(res){
      mensaje('Cliente activado correctamente', 'success')
    }else{
      mensaje('Error al activar el cliente', 'error')
    }
  }

    const saldo = cliente.Saldo! > 0 ? `text-red-500` : `text-emerald-500`

  return (
    <tr className="cursor-pointer transition-colors duration-150 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60">
      
      {/* Codigo */}
      <td className="px-6 py-4 text-xs font-mono font-semibold text-slate-600 dark:text-zinc-400">
        {cliente.Id}
      </td>

      {/* Nombre */}
      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-zinc-100">
        {cliente.Nombre}
      </td>

      {/* Cuit */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center text-xs font-mono font-medium text-slate-700 dark:text-zinc-300">
          {cliente.Cuit || '-'}
        </span>
      </td>

      {/* Saldo */}
      <td className="px-6 py-4 text-sm font-mono font-bold">
        <span className={`capitalize ${saldo}`}>${cliente.Saldo?.toFixed(2)}</span>
      </td>

      {/* Telefono */}
      <td className="px-6 py-4">
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 font-mono">
          {cliente.Telefono || '-'}
        </span>
      </td>

      {/* Direccion */}
      <td className="px-6 py-4">
        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">
          {cliente.Direccion ? `${cliente.Direccion}${cliente.Localidad ? ` - ${cliente.Localidad}` : ''}` : '-'}
        </span>
      </td>

      {/* Iva */}
      <td className="px-6 py-4">
        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
          {cliente.CondicionIva}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">

          <button onClick={handleEdit} className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all cursor-pointer">
            <EditIcon sx={{ fontSize: 18 }} />
          </button>

          {usuario?.Rol === 'admin' &&
           (<button disabled={cliente.Activo ? isPending : isPendingActivar} title={cliente.Activo ? 'Desactivar' : 'Activar'}  onClick={cliente.Activo ? handleDelete : handleActivar} className="p-1.5 text-slate-500 dark:text-zinc-400 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50">
            {
              cliente.Activo ? isPending ? <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
               : <DeleteIcon sx={{color: '#ef4444', fontSize: 18}} /> : 
               isPendingActivar 
               ? <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /> : 
               <GroupAddIcon sx={{color: '#22c55e', fontSize: 18}} />
            }
          </button>
        )}
          
        </div>
      </td>

    </tr>
  )
}