import { useState, useMemo } from 'react';
import { Cabecera, Loading, ModalCategoria } from '../compontents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Categoria } from '../interface';
import { useCategorias } from '../hooks';
import { usecategoriaStore } from '../store';

export const CategoriaScreen = () => {
  const { setCategoria, setModalAbierto, modalAbierto } = usecategoriaStore();
  const [buscador, setBuscador] = useState('');

  const { data: categorias, isLoading } = useCategorias();

  const abrirModalCrear = () => {
    setCategoria(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat: Categoria) => {
    setCategoria(cat);
    setModalAbierto(true);
  };

  // Filtrado de diseño
  const categoriasFiltradas = useMemo(() => {
    if (!buscador.trim()) return categorias || [];
    const query = buscador.toLowerCase();
    return categorias?.filter((c) => c.Nombre.toLowerCase().includes(query) || c.Descripcion?.toLowerCase().includes(query));
  }, [categorias, buscador]);

  // Cálculos rápidos de métricas
  const totalCategorias = categorias?.length || 0;
  const categoriasActivas = categorias?.filter((c) => c.Activo).length || 0;
  const totalArticulos = categorias?.reduce((acc, c) => acc + (c?.TotalProductos || 0), 0) || 0;

  if (isLoading) return <Loading text="Cargando Categorías..." />;

  return (
    <div className="h-[calc(100vh-50px)] bg-slate-50 dark:bg-zinc-950 p-6 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Cabecera superior con buscador */}
      <Cabecera
        titulo="Gestión de Categorías"
        descripcion="Organiza tus artículos por rubros, márgenes de utilidad y familias de hardware"
        textoBoton="Nueva Categoría"
        funcion={abrirModalCrear}
        buscador={buscador}
        setBuscador={setBuscador}
      />

      {/* Tarjetas de Métricas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Categorías</span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{totalCategorias}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Categorías Activas</span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{categoriasActivas}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
            <LayersIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Artículos Clasificados</span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">{totalArticulos}</div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la Tabla de Categorías */}
      <div className="relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden backdrop-blur-xs transition-colors duration-200">
        <div className="overflow-x-auto h-[45vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-20">ID</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Descripción</th>

                <th className="py-3.5 px-4 text-center">Productos</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
              {categorias && categoriasFiltradas && categoriasFiltradas?.length > 0 ? (
                categoriasFiltradas?.map((item) => (
                  <tr key={item.Id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 border-b border-slate-200 dark:border-zinc-800/60 text-sm">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">#CAT-{item.Id}</td>

                    {/* Nombre y Badge de color */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-zinc-100 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border`}>{item.Nombre}</span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 max-w-sm truncate text-xs">{item.Descripcion}</td>

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
                        <span className={`w-1.5 h-1.5 rounded-full ${item.Activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {item.Activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirModalEditar(item)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                          title="Editar Categoría"
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Eliminar Categoría"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-medium text-slate-700 dark:text-zinc-300">No se encontraron categorías</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">{buscador ? 'Prueba cambiando los términos de búsqueda' : 'No hay categorías registradas en el sistema'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla con contador */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>
            Mostrando {categoriasFiltradas?.length} de {totalCategorias} categorías
          </span>
          <span>Familias del Catálogo</span>
        </div>
      </div>

      {/* MODAL / FORMULARIO PARA AGREGAR O EDITAR CATEGORÍA */}
      {modalAbierto && <ModalCategoria />}
    </div>
  );
};
