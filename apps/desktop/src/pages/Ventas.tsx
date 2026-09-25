import { useEffect, useState } from 'react';

import { DrawerClientes, DrawerProductos, FooterVenta, HeaderVenta, Loading, ModalMetodosPago, ProductoVenta } from '../compontents';

import { MetodoPagoDetalle, CreatePresupuesto, CreateVenta } from '../interface';
import { useGlobalStore, useVentaStore } from '../store';
import { mensaje } from '../helper/mensaje';
import { imprimirPresupuesto, imprimirVenta } from '../helper/imprimir';
import { useClienteById, startPostVenta, startPostPresupuesto } from '../hooks';
// import { sacarIva } from '../helper/sacarIva';

export const Ventas = () => {
  const { ventaData, setVentaData, productosCarrito, clearProductosCarrito, resetVenta } = useVentaStore();

  const { usuario } = useGlobalStore();

  const { mutateAsync, isPending } = startPostVenta();

  const { mutateAsync: cargarPresupuesto, isPending: isPendingPresupuesto } = startPostPresupuesto();

  const { data: cliente, isLoading: isLoadingCliente, isError: isErrorClienteById } = useClienteById(ventaData.clienteId);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDrawerOpenProductos, setIsDrawerOpenProductos] = useState<boolean>(false);

  const [nombre, setNombre] = useState<string>(cliente?.nombre ?? '');
  const [cuit, setCuit] = useState<string>(cliente?.cuit ?? '');
  const [saldo, setSaldo] = useState<string>(cliente?.saldo?.toString() ?? '');
  const [telefono, setTelefono] = useState<string>(cliente?.telefono ?? '');
  const [localidad, setLocalidad] = useState<string>(cliente?.localidad ?? '');
  const [direccion, setDireccion] = useState<string>(cliente?.direccion ?? '');
  const [condicionFacturacion, setCondicionFacturacion] = useState<string>(cliente?.condicionFacturacion ?? '');
  const [condicionIva, setCondicionIva] = useState<string>(cliente?.condicionIva ?? '');
  const [observaciones, setObservaciones] = useState<string>(cliente?.observaciones ?? '');

  const [facturado, setFacturado] = useState<boolean>(false);

  //Productos
  const [codigo, setCodigo] = useState<string>('');

  //Metodo Pago
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoDetalle[]>([]);

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.Nombre);
      setCuit(cliente.Cuit);
      setSaldo(cliente.Saldo.toString() ?? '');
      setTelefono(cliente.Telefono ?? '');
      setLocalidad(cliente.Localidad ?? '');
      setDireccion(cliente.Direccion ?? '');
      setCondicionFacturacion(cliente.CondicionFacturacion ?? '');
      setCondicionIva(cliente.CondicionIva ?? '');
      setObservaciones(cliente.Observaciones ?? '');
    }
  }, [cliente]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.altKey && e.code === 'F9') {
        e.preventDefault();

        setFacturado(!facturado);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [facturado, setFacturado]);

  const handleAddVenta = async () => {
    if (!usuario || isPending || isPendingPresupuesto) return;

    if (productosCarrito.length === 0) return mensaje('Debe agregar productos', 'error');

    if (ventaData.tipoVenta === 'Presupuesto') {
      if ((!cuit || !condicionIva) && facturado) {
        mensaje('Debe ingresar el CUIT y la Condición de IVA', 'error');
        return;
      }

      // const [totalIva21, gravado21, totalIva105, gravado105, cantIva] = sacarIva(productosCarrito);

      // const esTipoA = condicionIva === 'Responsable Inscripto' || condicionIva === 'Monotributista';
      // const tipoCompFacturado = ventaData.esNotaCredito ? (esTipoA ? 'Credito A' : 'Credito B') : esTipoA ? 'Factura A' : 'Factura B';

      const presupuesto: CreatePresupuesto = {
        fecha: new Date().toISOString(),
        clienteId: ventaData.clienteId,
        usuarioId: usuario.Id,
        total: productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
        activo: 1,

        observaciones,

        clieteNombre: nombre,
        clienteTelefono: telefono,
        clienteDomicilio: direccion,
      };

      const res = await cargarPresupuesto({ presupuesto, productos: productosCarrito, facturado });

      if (res.ok) {
        mensaje('Presupuesto cargado correctamente', 'success');
        clearProductosCarrito();

        if (ventaData.impresion && res.presupuesto) {
          imprimirPresupuesto(res.presupuesto, 0);
        }

        return;
      } else {
        mensaje('Error al cargar el presupuesto', 'error');
        return;
      }
    }

    if ((!cuit || !condicionIva) && facturado) {
      mensaje('Debe ingresar el CUIT y la Condición de IVA', 'error');
      return;
    }
    const venta: CreateVenta = {
      fecha: new Date().toISOString(),
      clienteId: ventaData.clienteId,
      usuarioId: usuario.Id,
      total: productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
      activo: true,
      formaPago: ventaData.tipoPago,
      tipoComprobante: ventaData.tipoVenta,

      //Opcional
      clienteNombre: nombre,
      clienteTelefono: telefono,
      clienteDomicilio: direccion,
    };

    const res = await mutateAsync({ venta, metodosPagos: metodosPago, productos: productosCarrito, facturado, descontarStock: true, esNotaCredito: ventaData.esNotaCredito });

    if (res.ok) {
      mensaje('Venta cargada correctamente', 'success');

      setMetodosPago([]);
      resetVenta();
      reiniciarDatosCliente();

      if (ventaData.impresion && res.venta) {
        imprimirVenta(res.venta, 1);
      }
    } else {
      mensaje('Error al cargar la venta', 'error');
    }
  };

  const handleCancelar = async () => {
    if (productosCarrito.length > 0 && usuario) {
      resetVenta();
      setMetodosPago([]);
      reiniciarDatosCliente();
    }
  };

  const reiniciarDatosCliente = () => {
    setNombre('');
    setCuit('');
    setSaldo('');
    setTelefono('');
    setLocalidad('');
    setDireccion('');
    setCondicionFacturacion('');
    setCondicionIva('');
    setObservaciones('');
  };

  useEffect(() => {
    if (isErrorClienteById) {
      mensaje('El cliente no existe', 'error');
    }
  }, [isErrorClienteById]);

  return (
    <div className={`flex flex-col h-[calc(100vh-48px)] p-4 transition-colors duration-200 ${!facturado ? 'bg-black' : ''}`}>
      {/* Banner identificador de No Facturado */}
      {!facturado && (
        <div className="mb-3 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-amber-400 shrink-0 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black tracking-wider uppercase text-zinc-100">MODO VENTA NO FACTURADA</span>
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">(Presiona Alt + F9 para alternar a facturado)</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-black px-2.5 py-1 rounded-md border border-zinc-800 text-amber-400 tracking-wider">● NO FACTURADO</span>
        </div>
      )}

      {/* Banner identificador de Modo Nota de Crédito */}
      {ventaData.esNotaCredito && (
        <div className="mb-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Modo Generación de Nota de Crédito</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">(Se cargaron los ítems de la factura original. Solo puede modificar cantidades o eliminar ítems).</span>
          </div>
          <button type="button" onClick={() => resetVenta()} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
            Cancelar Nota de Crédito
          </button>
        </div>
      )}

      <div className="shrink-0">
        <HeaderVenta
          codigo={ventaData.clienteId}
          setCodigo={(id: number) => setVentaData({ ...ventaData, clienteId: id })}
          setIsDrawerOpen={setIsDrawerOpen}
          nombre={nombre}
          setNombre={setNombre}
          cuit={cuit}
          setCuit={setCuit}
          saldo={saldo}
          telefono={telefono}
          setTelefono={setTelefono}
          localidad={localidad}
          setLocalidad={setLocalidad}
          direccion={direccion}
          setDireccion={setDireccion}
          condicionIva={condicionIva}
          setCondicionIva={setCondicionIva}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          isLoadingCliente={isLoadingCliente}
        />
      </div>

      <div className="flex-1 min-h-98 flex flex-col">
        {!ventaData.esNotaCredito ? (
          <ProductoVenta codigo={codigo.toString()} setCodigo={setCodigo} setIsDrawerOpen={setIsDrawerOpenProductos} />
        ) : (
          <div className="flex-1 overflow-auto bg-white dark:bg-[#18181b] border-x border-slate-200 dark:border-zinc-800">
            <ProductoVenta codigo={codigo.toString()} setCodigo={setCodigo} setIsDrawerOpen={setIsDrawerOpenProductos} />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <FooterVenta
          clienteId={ventaData?.clienteId?.toString() || '1'}
          condicionFacturacion={Number(condicionFacturacion)}
          facturado={facturado}
          onCancelar={handleCancelar}
          onFacturar={() => {
            if (productosCarrito.length === 0) return mensaje('Debe agregar productos', 'error');
            if (ventaData.tipoPago === 'CD') {
              setIsModalOpen(true);
            } else {
              handleAddVenta();
            }
          }}
        />
      </div>

      <DrawerClientes
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCliente={(id: number, nombre: string) => {
          setVentaData({ ...ventaData, clienteId: Number(id) });
          setNombre(nombre);
          setIsDrawerOpen(false);
        }}
      />

      <DrawerProductos isOpen={isDrawerOpenProductos} onClose={() => setIsDrawerOpenProductos(false)} />

      <ModalMetodosPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metodosPago={metodosPago}
        setMetodosPago={setMetodosPago}
        cliente={cliente?.nombre}
        tipoComprobante={ventaData.tipoVenta}
        domicilio=""
        telefono=""
        onConfirm={handleAddVenta}
      />

      {(isPending || isPendingPresupuesto) && <Loading fullScreen text="Facturando..." />}
    </div>
  );
};
