import { Marca } from '../../interface'

import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMarcaStore } from '../../store';
import { useStartDeleteMarca } from '../../hooks';
import { mensaje } from '../../helper';

interface Props {
    item: Marca
}

export const MarcaItem = ({item}: Props) => {
  
    const { setModalAbierto, setMarca} = useMarcaStore();
    const { mutateAsync, isPending } = useStartDeleteMarca();


    const abrirModalEditar = (marca: Marca) => {
        setMarca(marca);
        setModalAbierto(true);
    };

    const deleteMarca = async() => {
      try {
         await mutateAsync(item.Id);
        

        mensaje('Marca eliminada correctamente', 'success')
      } catch (error) {
        mensaje('Error al eliminar la marca', 'error')
      }
    }
    
  return (
    <tr
                    key={item.Id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 border-b border-slate-200 dark:border-zinc-800/60 text-sm"
                  >
                    {/* Código / ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      #{item.Id.toString().padStart(2, '0')}
                    </td>

                    {/* Nombre e Icono */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-zinc-100 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20 uppercase">
                          {item.Nombre.slice(0, 2)}
                        </div>
                        <span className="font-semibold text-sm">{item.Nombre}</span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 max-w-xs truncate text-xs">
                      {item.Descripcion}
                    </td>

                    {/* Sitio Web */}
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {item.SitioWeb ? (
                        <a
                          href={item.SitioWeb}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <LanguageIcon className="w-3.5 h-3.5" />
                          <span>{item.SitioWeb.replace('https://', '')}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-600">-</span>
                      )}
                    </td>

                    {/* Total de productos */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                        {item.TotalProductos} u.
                      </span>
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
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.Activo ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {item.Activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirModalEditar(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          title="Editar Marca"
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </button>
                        <button
                        onClick={deleteMarca}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Eliminar Marca"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
  )
}
