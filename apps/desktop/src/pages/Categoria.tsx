import { useState, useMemo } from 'react';
import { Cabecera, Loading } from '../compontents';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Categoria } from '../interface';
import { useCategorias } from '../hooks';


export const CategoriaScreen = () => {
  const [buscador, setBuscador] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

  const { data: categorias, isLoading }= useCategorias();

  // Formulario mock para diseño
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: false
  });

  const abrirModalCrear = () => {
    setCategoriaAEditar(null);
    setFormData({
      nombre: '',
      descripcion: '',
      activo: false
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat: Categoria) => {
    setCategoriaAEditar(cat);
    setFormData({
      nombre: cat.Nombre,
      descripcion: cat.Descripcion || '',
      activo: cat.Activo
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaAEditar(null);
  };

  // Filtrado de diseño
  const categoriasFiltradas = useMemo(() => {
    if (!buscador.trim()) return categorias || [];
    const query = buscador.toLowerCase();
    return categorias?.filter(
      (c) =>
        c.Nombre.toLowerCase().includes(query) ||
        c.Descripcion?.toLowerCase().includes(query)
    );
  }, [categorias,buscador]);

  // Cálculos rápidos de métricas
  const totalCategorias = categorias?.length || 0;
  const categoriasActivas = categorias?.filter((c) => c.Activo).length || 0;
  const totalArticulos = categorias?.reduce((acc, c) => acc + (c?.TotalProductos || 0), 0) || 0;

  if (isLoading) return <Loading text="Cargando Categorías..." />;



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
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
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Categorías
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {totalCategorias}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Categorías Activas
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {categoriasActivas}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
            <LayersIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Artículos Clasificados
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {totalArticulos}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la Tabla de Categorías */}
      <div className="relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden backdrop-blur-xs transition-colors duration-200">
        <div className="overflow-x-auto">
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
                  <tr
                    key={item.Id_categoria}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 border-b border-slate-200 dark:border-zinc-800/60 text-sm"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      #CAT-{item.Id_categoria}
                    </td>

                    {/* Nombre y Badge de color */}
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-zinc-100 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border`}
                        >
                          {item.Nombre}
                        </span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 max-w-sm truncate text-xs">
                      {item.Descripcion}
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
                      <p className="text-base font-medium text-slate-700 dark:text-zinc-300">
                        No se encontraron categorías
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
                        {buscador
                          ? 'Prueba cambiando los términos de búsqueda'
                          : 'No hay categorías registradas en el sistema'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla con contador */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>Mostrando {categoriasFiltradas?.length} de {totalCategorias} categorías</span>
          <span>Familias del Catálogo</span>
        </div>
      </div>

      {/* MODAL / FORMULARIO PARA AGREGAR O EDITAR CATEGORÍA */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
          <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera del Modal */}
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    {categoriaAEditar ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {categoriaAEditar
                      ? `Modificando detalles de ${categoriaAEditar.Nombre}`
                      : 'Define una nueva familia de productos y sus márgenes'}
                  </p>
                </div>
              </div>
              <button
                onClick={cerrarModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario (Diseño sin lógica backend) */}
            <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4 overflow-y-auto">
              {/* Nombre de la Categoría */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Procesadores, Placas de Video, Monitores..."
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500"
                />
              </div>

              {/* Descripción de la Categoría */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre los tipos de hardware o periféricos incluidos..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-500 resize-none"
                />
              </div>

              {/* Estado: Activa / Inactiva */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
                  Estado de la Categoría
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, activo: true })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.activo
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Activa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, activo: false })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.activo === false
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20'
                        : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Inactiva</span>
                  </button>
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>{categoriaAEditar ? 'Actualizar Categoría' : 'Guardar Categoría'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
