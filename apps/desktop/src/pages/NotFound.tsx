import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';

export const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const accesosRapidos = [
    { label: 'Productos', icon: Inventory2Icon, path: '/' },
    { label: 'Categorías', icon: CategoryIcon, path: '/categorias' },
    { label: 'Marcas', icon: BrandingWatermarkIcon, path: '/marcas' },
  ];

  return (
    <div className="min-h-[calc(100vh-48px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Glow de fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-130 h-130 rounded-full bg-linear-to-tr from-amber-500/15 via-orange-500/10 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center flex flex-col items-center">
        {/* Contenedor del ícono principal */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5 backdrop-blur-xs">
            <SearchOffIcon className="text-5xl! text-amber-600 dark:text-amber-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md">404</span>
        </div>

        {/* Título y badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          Página no encontrada
        </span>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-zinc-50 mb-2">¿Te has perdido en el catálogo?</h1>

        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md mb-2 leading-relaxed">No pudimos encontrar la ruta que estás buscando:</p>

        <code className="inline-block px-3 py-1 mb-6 rounded-lg text-xs font-mono bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-amber-600 dark:text-amber-400">
          {location.pathname}
        </code>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <ArrowBackIcon className="text-base!" />
            <span>Volver atrás</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/25 active:scale-[0.98]"
          >
            <HomeIcon className="text-base!" />
            <span>Ir al inicio</span>
          </button>
        </div>

        {/* Accesos directos / Módulos recomendados */}
        <div className="w-full pt-6 border-t border-slate-200/80 dark:border-zinc-800/80">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">O navega directamente a un módulo</p>
          <div className="grid grid-cols-3 gap-2.5">
            {accesosRapidos.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all cursor-pointer group"
                >
                  <Icon className="text-lg! text-slate-500 dark:text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
