import React, { useEffect, useState } from 'react';
import Loading from '../ui/Loading';
import { startCrearProducto, useDatos } from '../../hooks';
import { useProductoStore } from '../../store';
import { mensaje } from '../../helper';
import { Categoria, CrearProductoDTO, Marca, Provedor, UnidadMedida } from '../../interface';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import BadgeIcon from '@mui/icons-material/Badge';
import { handleFormEnter } from '../../helper/handleFormEnter';
import { getCodigoProducto } from '../../services';

interface Props {
  onClose: () => void;
}

export const ModalProducto = ({ onClose }: Props) => {
  const esPrimerRender = React.useRef(true);
  const inputCodigoRef = React.useRef<HTMLInputElement>(null);

  const { data: datos, isLoading } = useDatos();

  const dolar = datos?.dolar.Valor ?? 1;

  const { productoSeleccionado, setProducto } = useProductoStore();

  //   const { mutateAsync: mutateAsyncActualizar, isPending: isPendingActualizar } = startActualizarProducto();

  const { mutateAsync: mutateAsyncCrear, isPending: isPendingCrear } = startCrearProducto();

  const [formData, setFormData] = useState<CrearProductoDTO>({
    codigoInterno: productoSeleccionado?.CodigoInterno || '',
    descripcion: productoSeleccionado?.Descripcion || '',
    codigoBarra: productoSeleccionado?.CodigoBarra || '',
    cod_fabrica: productoSeleccionado?.cod_fabrica || '',

    marcaId: productoSeleccionado?.MarcaId || 0,
    id_categoria: productoSeleccionado?.Id_categoria || 0,
    proveedorId: productoSeleccionado?.ProveedorId || 0,
    unidadId: productoSeleccionado?.UnidadId || 1,

    costo: productoSeleccionado?.Costo ?? 0,
    costoDolar: productoSeleccionado?.CostoDolar ?? 0,
    ganancia: productoSeleccionado?.Ganancia ?? 0,
    iva: productoSeleccionado?.IVA ?? 21,
    precio: productoSeleccionado?.Precio ?? 0,
    stock: productoSeleccionado?.Stock ?? 0,
  });

  const calcularCostoIva = (costo: number, costoDolar: number, iva: number): number => {
    const baseCosto = Number(costoDolar) !== 0 ? Number(costoDolar) * dolar : Number(costo);
    const porcentaje = costoDolar !== 0 ? Number(iva) : Number(iva);
    const resultado = baseCosto + baseCosto * (porcentaje / 100);
    return Number(resultado.toFixed(2));
  };

  const calcularTotal = (costo: number, costoDolar: number, iva: number, ganancia: number, cotizacion: number): number => {
    const costoMasUtilidad = calcularCostoIva(costo, costoDolar, iva);
    const conGanancia = costoMasUtilidad + costoMasUtilidad * (ganancia / 100);
    const resultado = Number(costoDolar) !== 0 ? conGanancia * cotizacion : conGanancia;
    return Number(resultado.toFixed(2));
  };

  const handleClose = () => {
    onClose();
    setProducto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcion.trim()) {
      mensaje('La descripción del producto es obligatoria', 'error');
      return;
    }

    const productoParseado: CrearProductoDTO = {
      codigoInterno: formData.codigoInterno,
      descripcion: formData.descripcion.trim(),
      codigoBarra: formData.codigoBarra,
      cod_fabrica: formData.cod_fabrica,
      unidadId: formData.unidadId ?? 1,
      marcaId: formData.marcaId,
      proveedorId: formData.proveedorId,
      id_categoria: formData.id_categoria,
      costo: Number(formData.costo),
      costoDolar: Number(formData.costoDolar),
      iva: Number(formData.iva),
      ganancia: Number(formData.ganancia),
      stock: Number(formData.stock),
    };

    // if (productoSeleccionado) {
    //   const res = await mutateAsyncActualizar(productoParseado);

    //   if (res.ok) {
    //     mensaje("Producto actualizado exitosamente!", "success");
    //     handleClose();
    //   } else {
    //     mensaje(res.msg || "Error al actualizar el Producto", "error");
    //   }
    //   return;
    // }

    const res = await mutateAsyncCrear(productoParseado);

    if (res.ok) {
      mensaje('Producto cargado exitosamente!', 'success');
      handleClose();
    } else {
      mensaje(res.msg || 'Error al crear el Producto', 'error');
    }
  };

  useEffect(() => {
    if (esPrimerRender.current) {
      esPrimerRender.current = false;
      if (productoSeleccionado) return;
    }
    const total = calcularTotal(formData.costo ?? 0, formData.costoDolar ?? 0, formData.iva ?? 0, formData.ganancia ?? 0, 1);
    setFormData((prev) => ({ ...prev, precio: total }));
  }, [formData.costo, formData.costoDolar, formData.iva, formData.ganancia]);

  const handleBlurCodigo = async () => {
    if (formData.codigoInterno.trim() && !productoSeleccionado) {
      try {
        const producto = await getCodigoProducto(formData.codigoInterno);

        if (producto) {
          mensaje('El codigo ya existe!', 'error');
          setFormData((prev) => ({ ...prev, codigoInterno: '' }));

          setTimeout(() => {
            inputCodigoRef.current?.focus();
          }, 0);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading || !datos) return <Loading fullScreen text="Cargando datos..." />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-fade-in overflow-y-auto">
      {/* Contenedor del Modal */}
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col my-8 transform scale-100 transition-all duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <BadgeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">{productoSeleccionado ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Complete los datos para {productoSeleccionado ? 'modificar' : 'registrar'} el producto.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con scroll interno */}
        <form onSubmit={handleSubmit} onKeyDown={handleFormEnter} className="p-2 space-y-6 overflow-y-auto">
          {/* Dólares / Valores de Referencia */}
          <div className="flex justify-end gap-4 p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300">
            <div className="flex items-center gap-2 border-l border-slate-300 dark:border-zinc-700 pl-4">
              <span className="text-slate-500 dark:text-zinc-400">Dólar: {dolar.toFixed(2)}</span>
            </div>
          </div>

          {/* Sección: Identificador */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Identificador</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Código Interno <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  ref={inputCodigoRef}
                  onBlur={handleBlurCodigo}
                  readOnly={productoSeleccionado !== null}
                  placeholder="Código"
                  value={formData.codigoInterno}
                  onChange={(e) => setFormData({ ...formData, codigoInterno: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Descripción del producto"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Código Barra</label>
                <input
                  type="text"
                  value={formData.codigoBarra}
                  placeholder="Código Barra"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      codigoBarra: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Código Fabrica</label>
                <input
                  type="text"
                  value={formData.cod_fabrica}
                  placeholder="Código Fabrica"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cod_fabrica: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sección: Información */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Información</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Marca</label>
                <select
                  value={formData.marcaId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marcaId: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">Seleccionar</option>
                  {datos?.marcas.map((marca: Marca) => (
                    <option key={marca.Id} value={marca.Id}>
                      {marca.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Rubro</label>
                <select
                  value={formData.id_categoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_categoria: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">Seleccionar</option>
                  {datos?.categorias.map((rubro: Categoria) => (
                    <option key={rubro.Id_categoria} value={rubro.Id_categoria}>
                      {rubro.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Proveedor</label>
                <select
                  value={formData.proveedorId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proveedorId: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">Seleccionar</option>
                  {datos?.proveedores.map((proveedor: Provedor) => (
                    <option key={proveedor.Id} value={proveedor.Id}>
                      {proveedor.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Unidad</label>
                <select
                  value={formData.unidadId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unidadId: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">Seleccionar</option>
                  {datos?.unidades.map((unidad: UnidadMedida) => (
                    <option key={unidad.Id} value={unidad.Id}>
                      {unidad.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Precios */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Precios</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Costo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.costo === 0 ? '' : formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value === '' ? 0 : Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Costo Dólar <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.costoDolar === 0 ? '' : formData.costoDolar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costoDolar: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Impuesto %</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.iva}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iva: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Costo + Iva</label>
                <div className="w-full px-3 py-2 bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold font-mono">
                  {calcularCostoIva(formData.costo ?? 0, formData.costoDolar ?? 0, formData.iva ?? 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Total */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Total</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Ganancia % <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ganancia}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ganancia: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Total <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.precio}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      precio: Number(e.target.value),
                    });
                  }}
                  className="w-full px-3 py-2  dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold font-mono  focus:outline-none "
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-zinc-400 font-medium pt-1">
            Los campos que tengan el <span className="text-red-500 font-bold">*</span> son obligatorios, los costos pueden contener el valor 0.
          </p>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-200/50 dark:border-zinc-800/50 sticky bottom-0 bg-white dark:bg-[#18181b] z-10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              Salir
            </button>
            <button
              type="submit"
              disabled={isPendingCrear}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isPendingCrear ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <SaveIcon className="w-5 h-5" />
                  <span>{productoSeleccionado ? 'Actualizar Producto' : 'Crear Producto'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
