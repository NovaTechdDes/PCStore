import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import { useGlobalStore, useProductoStore } from '../../store';
import { useDatos } from '../../hooks/useDatos';
import Loading from '../ui/Loading';
import { startActualizarStock } from '../../hooks/useProductos';
import { mensaje } from '../../helper/mensaje';
import Swal from 'sweetalert2';

interface Props {
  setShowAddMovModal: (value: boolean) => void;
}

type TypeMovimiento = 'Entrada' | 'Suma' | 'Resta';

export const ModalAddMovimiento = ({ setShowAddMovModal }: Props) => {
  const { usuario } = useGlobalStore();
  const { productoSeleccionado, setProducto } = useProductoStore();
  const { mutateAsync, isPending } = startActualizarStock();

  const { data: datos, isLoading } = useDatos();
  const provedores = datos?.proveedores || [];

  const [tipo, setTipo] = useState<TypeMovimiento>('Entrada');
  const [cantidad, setCantidad] = useState<number>(0);

  const [nroSerie, setNroSerie] = useState<string>('');
  const [provedor, setProvedor] = useState<string>('');
  const [factura, setFactura] = useState<string>('');

  const [error, setError] = useState<boolean>(false);

  const [series, setSeries] = useState<
    {
      nro_serie: string;
      numeroFactura: string;
      proveedorId: number;
    }[]
  >([]);

  if (!productoSeleccionado) return null;

  const stockBase = productoSeleccionado.Stock ?? 0;
  const nuevoStock = tipo === 'Resta' ? stockBase - cantidad : stockBase + cantidad;

  const desabilitadoAgregar = isPending || (series.length === 0 && tipo === 'Entrada') || nroSerie !== '';

  const handleClose = () => {
    setShowAddMovModal(false);
    setCantidad(0);
    setNroSerie('');
    setProvedor('');
    setFactura('');
    setSeries([]);
    setTipo('Entrada');
    setProducto(null);
  };

  const handleAddSeries = () => {
    if (factura.trim() === '' || provedor === '') {
      setError(true);
      return;
    }

    const nuevasSeries = [
      ...series,
      {
        nro_serie: nroSerie,
        numeroFactura: factura,
        proveedorId: Number(provedor),
      },
    ];

    setSeries(nuevasSeries);
    setNroSerie('');
    setError(false);
  };

  const handleRemoveSeries = (index: number) => {
    const nuevasSeries = series.filter((_, i) => i !== index);
    setSeries(nuevasSeries);
  };

  const handleSubmit = async () => {
    if (cantidad === 0 && series.length === 0) {
      mensaje('Debe ingresar una cantidad o una serie', 'error');
      return;
    }

    if (series.length > 0 && cantidad !== series.length) {
      const { isConfirmed } = await Swal.fire({
        title: '¿Seguro que desea continuar?',
        text: 'La cantidad no coincide con la cantidad de series',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      });
      if (!isConfirmed) {
        return;
      }
    }
    const cantidadEfectiva = cantidad !== 0 ? cantidad : series.length;
    console.log(cantidadEfectiva);
    const cantFinal = tipo === 'Resta' ? -Math.abs(cantidadEfectiva) : Math.abs(cantidadEfectiva);

    const res = await mutateAsync({
      productoId: productoSeleccionado.Id,
      stock: nuevoStock,
      tipo,
      descripcion: productoSeleccionado.Descripcion,
      series,
      vendedor: usuario?.Id,
      cant: cantFinal,
    });

    if (res.ok) {
      mensaje(res.msg || 'Movimiento cargado correctamente', 'success');
      handleClose();
    } else {
      mensaje(res.msg || 'Error al cargar el movimiento', 'error');
    }
  };

  if (isLoading) return <Loading text="Cargando datos" fullScreen />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-fade-in overflow-y-auto">
      {/* Contenedor del Modal */}
      <div
        className="w-full max-w-5xl bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col my-8 transform scale-100 transition-all duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <PostAddIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">Agregar Movimiento del Producto</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {productoSeleccionado.Descripcion} ({productoSeleccionado.Id})
              </p>
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

        {/* Formulario */}
        <form className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Sección: Operación */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 relative pt-5">
            <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Operación</span>
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-200">
                <input
                  onChange={(e) => setTipo(e.target.value as TypeMovimiento)}
                  type="radio"
                  name="operacion"
                  value="Entrada"
                  defaultChecked
                  className="w-4 h-4 text-amber-500 accent-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                Compra
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-200">
                <input
                  onChange={(e) => setTipo(e.target.value as TypeMovimiento)}
                  type="radio"
                  name="operacion"
                  value="Suma"
                  className="w-4 h-4 text-amber-500 accent-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                Suma
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-zinc-200">
                <input
                  onChange={(e) => setTipo(e.target.value as TypeMovimiento)}
                  type="radio"
                  name="operacion"
                  value="Resta"
                  className="w-4 h-4 text-amber-500 accent-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                Resta
              </label>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Columna Izquierda: Stock, Cantidad y Nuevo Stock */}
            <div className="md:col-span-4 space-y-4 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 relative pt-5 bg-slate-50/50 dark:bg-zinc-900/20">
              <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Resumen Stock</span>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Stock</label>
                <input
                  type="text"
                  readOnly
                  value={productoSeleccionado.Stock?.toFixed(2) ?? '0.00'}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold font-mono cursor-default"
                />
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cantidad || ''}
                  onChange={(e) => setCantidad(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Nuevo Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nuevo Stock</label>
                <input
                  type="text"
                  value={nuevoStock}
                  readOnly
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold font-mono cursor-default"
                />
              </div>
            </div>

            {/* Columna Derecha: Formulario de carga de ítems y Tabla */}
            <div className="md:col-span-8 space-y-4">
              {/* Inputs de carga con botón + */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border border-slate-200 dark:border-zinc-800 rounded-xl p-4 relative pt-5">
                <span className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 text-xs font-bold text-amber-600 dark:text-amber-400">Detalles del Movimiento</span>

                {/* Nro Serie */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nro Serie</label>
                  <input
                    value={nroSerie}
                    onChange={(e) => setNroSerie(e.target.value)}
                    type="text"
                    placeholder="Número de serie"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  />
                </div>

                {/* Proveedor */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Provedor</label>
                  <select
                    value={provedor}
                    onChange={(e) => setProvedor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  >
                    <option value="">Seleccione proveedor</option>
                    {provedores.map((prov) => (
                      <option key={prov.Id} value={prov.Id}>
                        {prov.Nombre}
                      </option>
                    ))}
                  </select>
                  {error && provedor === '' && <p className="text-xs text-red-500 mt-1">Debe seleccionar un provedor</p>}
                </div>

                {/* Numero de Factura */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Numero de Factura</label>
                  <input
                    type="text"
                    value={factura}
                    onChange={(e) => setFactura(e.target.value)}
                    placeholder="Nro Factura"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  />
                  {error && factura.trim() === '' && <p className="text-xs text-red-500 mt-1">Debe ingresar un numero</p>}
                </div>

                {/* Botón + */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={handleAddSeries}
                    type="button"
                    className="w-full h-8.5 flex items-center justify-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
                    title="Agregar item"
                  >
                    <AddIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider sticky top-0 ">
                        <th className="px-4 py-2.5">Indice</th>
                        <th className="px-4 py-2.5">Nro Serie</th>
                        <th className="px-4 py-2.5">Provedor</th>
                        <th className="px-4 py-2.5">Numero Factura</th>
                        <th className="px-4 py-2.5 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 bg-white dark:bg-[#18181b]">
                      {series.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                            No hay ítems cargados en la lista.
                          </td>
                        </tr>
                      ) : (
                        series.map((serie, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-100">{index + 1}</td>
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-100">{serie.nro_serie}</td>
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-100">{provedores.find((p) => p.Id === serie.proveedorId)?.Nombre ?? ''}</td>
                            <td className="px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-100">{serie.numeroFactura}</td>
                            <td className="px-4 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSeries(index)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                              >
                                <CloseIcon className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {series.length === 0 && tipo === 'Entrada' && <p className="text-sm text-red-500 dark:text-red-600 text-end mt-2">Se necesita obligatoriamente un proveedor y un número de factura</p>}
              {nroSerie !== '' && <p className="text-sm text-red-500 dark:text-red-600 text-end mt-2">Hay un numero de serie escrito para precarga, agregalo</p>}
              {cantidad !== series.length && tipo === 'Entrada' && (
                <p className="text-sm text-red-500 dark:text-red-600 text-end mt-2">Faltan {cantidad - series.length} nros de serie para completar el movimiento</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer / Botones */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
          >
            Salir
          </button>
          <button
            onClick={handleSubmit}
            disabled={desabilitadoAgregar}
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loading size="xs" showText={false} /> : <SaveIcon className="w-4 h-4" />}
            <span>{isPending ? 'Guardando...' : 'Aceptar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
