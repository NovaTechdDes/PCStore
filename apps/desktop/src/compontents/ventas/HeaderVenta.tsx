import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotesIcon from '@mui/icons-material/Notes';
import SearchIcon from '@mui/icons-material/Search';
import { handleFormEnter } from '../../helper/handleFormEnter';
import Loading from '../ui/Loading';
import { useVentaStore } from '../../store';

interface HeaderVentaProps {
  codigo?: number;
  setCodigo?: (val: number) => void;
  setIsDrawerOpen: (val: boolean) => void;
  nombre?: string;
  setNombre?: (val: string) => void;
  cuit?: string;
  setCuit?: (val: string) => void;
  saldo?: number | string;
  telefono?: string;
  setTelefono?: (val: string) => void;
  localidad?: string;
  setLocalidad?: (val: string) => void;
  direccion?: string;
  setDireccion?: (val: string) => void;
  condicionIva?: string;
  setCondicionIva?: (val: string) => void;
  observaciones?: string;
  setObservaciones?: (val: string) => void;
  onSearchCliente?: () => void;
  isLoadingCliente?: boolean;
}

export const HeaderVenta = ({
  codigo = 1,
  setCodigo,
  setIsDrawerOpen,
  nombre = '',
  setNombre,
  cuit = '',
  setCuit,
  saldo = '0.00',
  telefono = '',
  setTelefono,
  localidad = '',
  setLocalidad,
  direccion = '',
  setDireccion,
  condicionIva = 'Consumidor Final',
  setCondicionIva,
  observaciones = '',
  setObservaciones,
  onSearchCliente,
  isLoadingCliente,
}: HeaderVentaProps) => {
  const { ventaData } = useVentaStore();

  const inputClass = !ventaData.facturado
    ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all'
    : 'bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all';

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1 ${!ventaData.facturado ? 'text-zinc-400' : 'text-slate-700 dark:text-zinc-400'}`;
  const iconClass = `absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${!ventaData.facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`;

  return (
    <header
      className={`rounded-t-2xl border p-5 shadow-xs space-y-4 transition-colors ${
        !ventaData.facturado ? 'bg-black border-zinc-800 text-white' : 'bg-white dark:bg-[#18181b] border-slate-200 dark:border-zinc-800'
      }`}
    >
      <form onKeyDown={handleFormEnter}>
        {/* Fila 1: Código, Nombre, Cuit, Saldo, Lista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5">
          {/* Código */}
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <label htmlFor="codigo-cliente" className={labelClass}>
              Código
            </label>
            <div className="relative flex items-center gap-1.5">
              <div className="relative flex-1">
                <TagIcon className={iconClass} />
                <input
                  type="text"
                  id="codigo-cliente"
                  name="codigo"
                  placeholder="Código"
                  value={codigo === 0 ? '' : codigo}
                  onChange={(e) => setCodigo?.(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!codigo) {
                        e.preventDefault();
                        setIsDrawerOpen(true);
                      }
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono font-medium ${inputClass}`}
                />
              </div>
              {onSearchCliente && (
                <button
                  type="button"
                  onClick={onSearchCliente}
                  className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Buscar Cliente"
                >
                  <SearchIcon className="w-3.5 h-3.5" />
                </button>
              )}
              {isLoadingCliente && <Loading size="xs" showText={false} />}
            </div>
          </div>

          {/* Nombre */}
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label htmlFor="nombre-cliente" className={labelClass}>
              Nombre
            </label>
            <div className="relative">
              <PersonIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${!ventaData.facturado ? 'text-zinc-500' : 'text-slate-500 dark:text-zinc-400'}`} />
              <input
                type="text"
                id="nombre-cliente"
                name="nombre"
                readOnly={codigo !== 1}
                placeholder="Nombre Cliente"
                value={nombre}
                onChange={(e) => setNombre?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-sm font-semibold ${inputClass}`}
              />
            </div>
          </div>

          {/* Cuit */}
          <div className="col-span-12 sm:col-span-4 md:col-span-2">
            <label htmlFor="cuit-cliente" className={labelClass}>
              Cuit
            </label>
            <div className="relative">
              <BadgeIcon className={iconClass} />
              <input
                type="text"
                readOnly={codigo !== 1}
                id="cuit-cliente"
                name="cuit"
                placeholder="CUIT / DNI"
                value={cuit}
                onChange={(e) => setCuit?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono font-medium ${inputClass}`}
              />
            </div>
          </div>

          {/* Saldo */}
          <div className="col-span-12 sm:col-span-4 md:col-span-2">
            <label htmlFor="saldo-cliente" className={labelClass}>
              Saldo
            </label>
            <div className="relative">
              <AttachMoneyIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 w-3.5 h-3.5" />
              <input
                type="text"
                id="saldo-cliente"
                name="saldo"
                readOnly
                value={typeof saldo === 'number' ? saldo.toFixed(2) : saldo}
                placeholder="0.00"
                className={`w-full pl-8 pr-3 py-2 border font-bold rounded-xl text-xs focus:outline-none select-none font-mono ${
                  !ventaData.facturado ? 'bg-zinc-950 border-amber-500/40 text-amber-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Fila 2: Teléfono, Localidad, Dirección, Condición IVA, Observaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Teléfono */}
          <div>
            <label htmlFor="telefono-cliente" className={labelClass}>
              Teléfono
            </label>
            <div className="relative">
              <PhoneIcon className={iconClass} />
              <input
                type="text"
                id="telefono-cliente"
                readOnly={codigo !== 1}
                name="telefono"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-mono font-medium ${inputClass}`}
              />
            </div>
          </div>

          {/* Localidad */}
          <div>
            <label htmlFor="localidad-cliente" className={labelClass}>
              Localidad
            </label>
            <div className="relative">
              <LocationOnIcon className={iconClass} />
              <input
                type="text"
                id="localidad-cliente"
                readOnly={codigo !== 1}
                name="localidad"
                placeholder="Localidad"
                value={localidad}
                onChange={(e) => setLocalidad?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium ${inputClass}`}
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="direccion-cliente" className={labelClass}>
              Dirección
            </label>
            <div className="relative">
              <HomeIcon className={iconClass} />
              <input
                type="text"
                id="direccion-cliente"
                readOnly={codigo !== 1}
                name="direccion"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium ${inputClass}`}
              />
            </div>
          </div>

          {/* Condición IVA */}
          <div>
            <label htmlFor="condicion-iva" className={labelClass}>
              Condición IVA
            </label>
            <div className="relative">
              <ReceiptIcon className={`${iconClass} pointer-events-none`} />
              <select
                id="condicion-iva"
                name="condicionIva"
                disabled={codigo !== 1}
                value={condicionIva}
                onChange={(e) => setCondicionIva?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium appearance-none cursor-pointer ${inputClass}`}
              >
                <option value="Consumidor Final">Consumidor Final</option>
                <option value="Responsable Inscripto">Responsable Inscripto</option>
                <option value="Monotributo">Monotributo</option>
                <option value="Exento">Exento</option>
              </select>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label htmlFor="observaciones-venta" className={labelClass}>
              Observaciones
            </label>
            <div className="relative">
              <NotesIcon className={iconClass} />
              <input
                type="text"
                id="observaciones-venta"
                name="observaciones"
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones?.(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs font-medium ${inputClass}`}
              />
            </div>
          </div>
        </div>
      </form>
    </header>
  );
};
