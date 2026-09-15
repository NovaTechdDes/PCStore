import { useEffect, useState } from 'react';

import { DrawerClientes, FooterVenta, HeaderVenta, Loading, ModalMetodosPago, ProductoVenta, DrawerProductos } from '../compontents';

import { useDatos } from '../hooks/useDatos';
import { MetodoPagoDetalle, Venta, Presupuesto } from '../interface';
import { useGlobalStore, useVentaStore } from '../store';
import { mensaje } from '../helper/mensaje';
import { imprimirPresupuesto, imprimirRemito, imprimirVenta } from '../helper/imprimir';
import { startPostRemito, useClienteById, startPostVenta, startPostPresupuesto } from '../hooks';

export const Ventas = () => {
  const {} = useVentaStore();
  const { data: datos } = useDatos();
  const { usuario } = useGlobalStore();

  const { mutateAsync, isPending } = startPostVenta();
  const { mutateAsync: cargarRemito, isPending: isPendingCargarRemito } = startPostRemito();
  const { mutateAsync: cargarPresupuesto, isPending: isPendingPresupuesto } = startPostPresupuesto();

  const { data: cliente, isLoading: isLoadingCliente } = useClienteById(clienteIdStore);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDrawerOpenProductos, setIsDrawerOpenProductos] = useState<boolean>(false);

  const [nombre, setNombre] = useState<string>(cliente?.nombre ?? '');
  const [cuit, setCuit] = useState<string>(cliente?.cuit ?? '');
  const [saldo, setSaldo] = useState<string>(cliente?.saldo?.toString() ?? '');
  const [lista, setLista] = useState<string>(cliente?.saldo?.toString() ?? '');
  const [telefono, setTelefono] = useState<string>(cliente?.telefono ?? '');
  const [localidad, setLocalidad] = useState<string>(cliente?.localidad ?? '');
  const [direccion, setDireccion] = useState<string>(cliente?.direccion ?? '');
  const [condicionIva, setCondicionIva] = useState<string>(cliente?.condicionIva ?? '');
  const [observaciones, setObservaciones] = useState<string>(cliente?.observaciones ?? '');

  //Productos
  const [codigo, setCodigo] = useState<string>('');

  //Metodo Pago
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [metodosPago, setMetodosPago] = useState<MetodoPagoDetalle[]>([]);

  useEffect(() => {
    if (cliente) {
      setCliente(cliente);
      setNombre(cliente.nombre);
      setCuit(cliente.cuit);
      setSaldo(cliente.saldo?.toString() ?? '');
      setLista(cliente.tipoCuenta?.toString() ?? '');
      setTelefono(cliente.telefono ?? '');
      setLocalidad(cliente.localidad ?? '');
      setDireccion(cliente.direccion ?? '');
      setCondicionIva(cliente.condicionIva ?? '');
      setObservaciones(cliente.observaciones ?? '');
    }
  }, [cliente]);

  useEffect(() => {
    const nuevaLista = lista === 'INSTALADOR' ? 'INSTALADOR' : 'NORMAL';
    setListPrecios(nuevaLista);

    if (datos?.numeros) {
      recalcularPrecioscarrito(nuevaLista, datos.numeros);
    }
  }, [lista, datos]);

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
    if (!usuario || isPending || isPendingCargarRemito || isPendingPresupuesto) return;

    if (productosCarrito.length === 0) return mensaje('Debe agregar productos', 'error');

    if (tipoVenta === 'Remito') {
      const remito: Remito = {
        fecha: new Date(),
        idCliente: clienteId,
        cliente: nombre,
        tipo_comp: 'REMITO',
        tipo_venta: 'RT',
        observaciones: '',
        pasado: false,
        vendedor: usuario._id,
        caja: '',
      };

      const res = await cargarRemito({ remito, productos: productosCarrito, descontarStock: remitos.length > 0 ? false : true, remitos });

      if (res.ok) {
        mensaje('Remito cargado correctamente', 'success');
        setRemitos([]);
        setClienteId('1');
        clearProductosCarrito();

        if (impresion) {
          imprimirRemito(res.remito);
        }
        return;
      } else {
        mensaje(res.msg || 'Error al cargar el remito', 'error');
        return;
      }
    } else if (tipoVenta === 'Presupuesto') {
      if ((!cuit || !condicionIva) && facturado) {
        mensaje('Debe ingresar el CUIT y la Condición de IVA', 'error');
        return;
      }

      const [totalIva21, gravado21, totalIva105, gravado105, cantIva] = sacarIva(productosCarrito);

      const esTipoA = condicionIva === 'Responsable Inscripto' || condicionIva === 'Monotributista';
      const tipoCompFacturado = esNotaCredito ? (esTipoA ? 'Credito A' : 'Credito B') : esTipoA ? 'Factura A' : 'Factura B';

      const presupuesto: Presupuesto = {
        fecha: new Date().toISOString(),
        idCliente: clienteId,
        cliente: nombre,
        tipo_comp: facturado ? tipoCompFacturado : 'PRESUPUESTO',
        tipo_venta: 'PP',
        condicion: listPrecios,
        precio: productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
        vendedor: usuario._id,
        F: facturado,
        dolar: datos?.numeros ? (listPrecios === 'INSTALADOR' ? datos.numeros.dolarInstalador : datos.numeros.Dolar) : 0,
        observaciones: observaciones || '',

        // Afip
        condicionIva,
        num_doc: cuit !== '' ? cuit : '00000000',
        cod_doc: cuit === '00000000' || cuit === '' ? 99 : cuit.length > 8 ? 80 : 90,
        cod_comp: cuit.length > 8 && (condicionIva === 'Responsable Inscripto' || condicionIva === 'Monotributista') ? (esNotaCredito ? 3 : 1) : esNotaCredito ? 8 : 6,
        cantIva,
        iva21: totalIva21,
        gravado21,
        iva105: totalIva105,
        gravado105,
        facturaAnterior: numeroAfip,

        //Opcional
        direccion,
        telefono,
        localidad,
      };

      const res = await cargarPresupuesto({ presupuesto, productos: productosCarrito, facturado });

      if (res.ok) {
        mensaje('Presupuesto cargado correctamente', 'success');
        setClienteId('1');
        clearProductosCarrito();
        setRemitos([]);

        if (impresion && res.presupuesto && datos) {
          const dolarImprimir = listPrecios === 'INSTALADOR' ? datos.numeros.dolarInstalador : datos.numeros.Dolar;
          imprimirPresupuesto(res.presupuesto, dolar ? dolarImprimir : 0);
        }

        return;
      } else {
        mensaje(res.msg || 'Error al cargar el presupuesto', 'error');
        return;
      }
    }

    if ((!cuit || !condicionIva) && facturado) {
      mensaje('Debe ingresar el CUIT y la Condición de IVA', 'error');
      return;
    }

    const [totalIva21, gravado21, totalIva105, gravado105, cantIva] = sacarIva(productosCarrito);

    const esTipoA = condicionIva === 'Responsable Inscripto' || condicionIva === 'Monotributista';

    const tipoCompFacturado = esNotaCredito ? (esTipoA ? 'Credito A' : 'Credito B') : esTipoA ? 'Factura A' : 'Factura B';
    const venta: Venta = {
      fecha: new Date().toISOString(),
      idCliente: clienteId,
      cliente: nombre,
      tipo_comp: facturado ? tipoCompFacturado : tipoVenta,
      tipo_venta: tipoPago,
      condicion: listPrecios,
      precio: productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
      vendedor: usuario._id,
      F: facturado,
      dolar: datos?.numeros ? (listPrecios === 'INSTALADOR' ? datos?.numeros.dolarInstalador : datos?.numeros.Dolar) : 0,

      // Afip
      condicionIva,
      num_doc: cuit !== '' ? cuit : '00000000',
      cod_doc: cuit === '00000000' || cuit === '' ? 99 : cuit.length > 8 ? 80 : 90,
      cod_comp: cuit.length > 8 && (condicionIva === 'Responsable Inscripto' || condicionIva === 'Monotributista') ? (esNotaCredito ? 3 : 1) : esNotaCredito ? 8 : 6,
      cantIva,
      iva21: totalIva21,
      gravado21,
      iva105: totalIva105,
      gravado105,
      facturaAnterior: numeroAfip,

      //Opcional
      direccion,
      telefono,
      localidad,
    };

    const res = await mutateAsync({ venta, metodosPagos: metodosPago, productos: productosCarrito, facturado, descontarStock: remitos.length > 0 ? false : true, remitos, esNotaCredito });

    if (res.ok) {
      mensaje('Venta cargada correctamente', 'success');
      setClienteId('1');
      setMetodosPago([]);
      clearProductosCarrito();
      setRemitos([]);
      if (impresion && datos) {
        const dolarImprimir = listPrecios === 'INSTALADOR' ? datos?.numeros.dolarInstalador : datos?.numeros.Dolar;
        imprimirVenta(res.venta, dolar ? dolarImprimir : 0);
      }
    } else {
      mensaje(res.msg || 'Error al cargar la venta', 'error');
    }
  };

  const handleCancelar = async () => {
    if (isPendingGerencia) return;
    if (productosCarrito.length > 0 && usuario) {
      const ventaGerencia: Gerencia = {
        fecha: new Date().toISOString(),
        idCliente: clienteId,
        cliente: nombre,
        tipo_comp: 'Gerencia',
        tipo_venta: 'GR',
        precio: productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0),
        vendedor: usuario._id,
        dolar: datos?.numeros ? (listPrecios === 'INSTALADOR' ? datos?.numeros.dolarInstalador : datos?.numeros.Dolar) : 0,
      };

      try {
        const res = await cargarGerencia({
          gerencia: ventaGerencia,
          productos: productosCarrito,
        });

        if (!res.ok) {
          mensaje(res.msg || 'Error al guardar el registro en gerencia', 'error');
          return;
        }
      } catch (error) {
        mensaje('Error al guardar el registro en gerencia', 'error');
        return;
      }
    }
    setClienteId('1');
    setMetodosPago([]);
    clearProductosCarrito();
    setRemitos([]);
  };

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
      {esNotaCredito && (
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
          codigo={clienteId}
          setCodigo={setClienteId}
          setIsDrawerOpen={setIsDrawerOpen}
          nombre={nombre}
          setNombre={setNombre}
          cuit={cuit}
          setCuit={setCuit}
          saldo={saldo}
          lista={lista}
          setLista={setLista}
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
        {!esNotaCredito ? (
          <ProductoVenta codigo={codigo} setCodigo={setCodigo} setIsDrawerOpen={setIsDrawerOpenProductos} />
        ) : (
          <div className="flex-1 overflow-auto bg-white dark:bg-[#18181b] border-x border-slate-200 dark:border-zinc-800">
            <ProductoVenta codigo={codigo} setCodigo={setCodigo} setIsDrawerOpen={setIsDrawerOpenProductos} />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <FooterVenta
          clienteId={clienteId}
          condicionFacturacion={condicionFacturacion}
          facturado={facturado}
          onCancelar={handleCancelar}
          onFacturar={() => {
            if (productosCarrito.length === 0) return mensaje('Debe agregar productos', 'error');
            if (tipoPago === 'CD') {
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
        onSelectCliente={(id, nombre) => {
          setClienteId(id);
          setNombre(nombre);
          setIsDrawerOpen(false);
        }}
      />

      <DrawerProductos
        isOpen={isDrawerOpenProductos}
        onClose={() => setIsDrawerOpenProductos(false)}
        onSelectProducto={(id) => {
          setCodigo(id);
          setIsDrawerOpenProductos(false);
        }}
      />

      <ModalMetodosPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metodosPago={metodosPago}
        setMetodosPago={setMetodosPago}
        cliente={cliente?.nombre}
        tipoComprobante={tipoVenta}
        domicilio=""
        telefono=""
        onConfirm={handleAddVenta}
      />

      {(isPending || isPendingCargarRemito || isPendingPresupuesto || isPendingGerencia) && <Loading fullScreen text="Facturando..." />}
    </div>
  );
};
