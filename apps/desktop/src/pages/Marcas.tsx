import { useState, useMemo } from 'react';
import { Cabecera, Loading, MarcaItem } from '../compontents';
import { useMarcas } from '../hooks';
import { Marca } from '../interface';
import { ModalMarca } from '../compontents/marcas/ModalMarca';
import { useMarcaStore } from '../store';


import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';





export const Marcas = () => {
  const { setModalAbierto, modalAbierto, setMarca} = useMarcaStore()
  const { data: marcas, isLoading, error } = useMarcas();

  const [buscador, setBuscador] = useState('');

  // Formulario mock (estado puramente visual)
 
  const abrirModalCrear = () => {
    setMarca(null);
    setModalAbierto(true);
  };

  // Filtrado de diseño para búsqueda interactiva
  const marcasFiltradas = useMemo(() => {
    if (!buscador.trim()) return marcas;
    const query = buscador.toLowerCase();
    return marcas?.filter(
      (m) =>
        m.Nombre.toLowerCase().includes(query) ||
        m.Descripcion.toLowerCase().includes(query)
    );
  }, [marcas, buscador]);

  // Cálculos de métricas rápidas de diseño
  const totalMarcas = marcas?.length;
  const marcasActivas = marcas?.filter((m) => m.Activo).length;
  const totalProductos = marcas?.reduce((acc, m) => acc + Number(m.TotalProductos || 0), 0) || 0;

  if(isLoading) return <Loading text='Cargando Marcas...'/>

  if(error) return <div>
    <Cabecera
        titulo="Gestión de Marcas"
        descripcion="Administra y cataloga las marcas y fabricantes de tus productos"
        textoBoton="Nueva Marca"
        funcion={abrirModalCrear}
        buscador={buscador}
        setBuscador={setBuscador}
      />
    <p>Error al cargar las marcas</p>
  </div>
  

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Cabecera superior estándar del sistema */}
      <Cabecera
        titulo="Gestión de Marcas"
        descripcion="Administra y cataloga las marcas y fabricantes de tus productos"
        textoBoton="Nueva Marca"
        funcion={abrirModalCrear}
        buscador={buscador}
        setBuscador={setBuscador}
      />

      {/* Tarjetas de Métricas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <BrandingWatermarkIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Total de Marcas
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {totalMarcas}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Marcas Activas
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {marcasActivas}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4.5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Inventory2OutlinedIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Productos Vinculados
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
              {totalProductos ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal de la Tabla de Marcas */}
      <div className="relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden backdrop-blur-xs transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Marca</th>
                <th className="py-3.5 px-4">Descripción</th>
                <th className="py-3.5 px-4">Sitio Oficial</th>
                <th className="py-3.5 px-4 text-center">Productos</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
              {marcasFiltradas && marcasFiltradas.length > 0 ? (
                marcasFiltradas.map((item) => <MarcaItem item={item} key={item.Id} />)
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-medium text-slate-700 dark:text-zinc-300">
                        No se encontraron marcas
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
                        {buscador
                          ? 'Prueba cambiando los términos de búsqueda'
                          : 'No hay marcas registradas en el catálogo'}
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
          <span>Mostrando {marcasFiltradas?.length} de {marcas?.length} marcas</span>
          <span>Catálogo de Fabricantes</span>
        </div>
      </div>

      {/* MODAL / FORMULARIO PARA AGREGAR O EDITAR MARCA */}
      {modalAbierto && <ModalMarca />}
    </div>
  );
};
