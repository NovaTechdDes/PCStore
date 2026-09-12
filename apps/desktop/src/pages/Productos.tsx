import { useState, useMemo } from "react";
import {
  Cabecera,
  ProductosItem,
  Loading,
  ModalAddMovimiento,
  ModalProducto,
} from "../compontents";
import { useProductos } from "../hooks";

export const Productos = () => {
  const [buscador, setBuscador] = useState("");
  const [viewModalAddProducto, setViewModalAddProducto] =
    useState<boolean>(false);
  const [viewModalMovimiento, setViewModalMovimiento] =
    useState<boolean>(false);
  const { data, isLoading } = useProductos();

  const productosFiltrados = useMemo(() => {
    if (!data) return [];
    if (!buscador.trim()) return data;

    const query = buscador.toLowerCase();
    return data.filter(
      (item) =>
        item.Descripcion?.toLowerCase().includes(query) ||
        item.CodigoInterno?.toLowerCase().includes(query) ||
        item.CodigoBarra?.toLowerCase().includes(query) ||
        item.cod_fabrica?.toLowerCase().includes(query) ||
        item.MarcaNombre?.toLowerCase().includes(query) ||
        item.CategoriaNombre?.toLowerCase().includes(query),
    );
  }, [data, buscador]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 space-y-6 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Cabecera superior con buscador */}
      <Cabecera
        titulo="Gestión de Productos"
        descripcion="Administra el catálogo de productos, precios y control de stock"
        textoBoton="Nuevo Producto"
        funcion={() => {
          setViewModalAddProducto(true);
        }}
        buscador={buscador}
        setBuscador={setBuscador}
      />

      {/* Contenedor principal de la Tabla */}
      <div className="relative bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden backdrop-blur-xs transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Código Int.</th>
                <th className="py-3.5 px-4">Cód. Barra</th>
                <th className="py-3.5 px-4">Descripción</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Marca</th>
                <th className="py-3.5 px-4">Cód. Fábrica</th>
                <th className="py-3.5 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60">
              {/* Estado de Carga (Loading Skeleton) */}
              {isLoading ? (
                <>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="animate-pulse border-b border-slate-200 dark:border-zinc-800/60"
                    >
                      <td className="py-4 px-4">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : productosFiltrados.length > 0 ? (
                productosFiltrados.map((elem) => (
                  <ProductosItem
                    key={elem.Id || elem.CodigoInterno}
                    item={elem}
                    setShowAddMovModal={setViewModalMovimiento}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-500 dark:text-zinc-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-base font-medium text-slate-700 dark:text-zinc-300">
                        No se encontraron productos
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">
                        {buscador
                          ? "Prueba cambiando los términos de búsqueda"
                          : "No hay productos registrados en el sistema"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Indicador flotante de carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3">
              <Loading size="sm" showText={false} />
              <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                Cargando productos...
              </span>
            </div>
          </div>
        )}
      </div>

      {viewModalAddProducto && (
        <ModalProducto onClose={() => setViewModalAddProducto(false)} />
      )}
      {viewModalMovimiento && (
        <ModalAddMovimiento setShowAddMovModal={setViewModalMovimiento} />
      )}
    </div>
  );
};
