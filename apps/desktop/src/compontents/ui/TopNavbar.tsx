import { useState, MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StorageIcon from '@mui/icons-material/Storage';
import BadgeIcon from '@mui/icons-material/Badge';
import CategoryIcon from '@mui/icons-material/Category';
import SellIcon from '@mui/icons-material/Sell';
import SettingsIcon from '@mui/icons-material/Settings';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import ErrorIcon from '@mui/icons-material/Error';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';

export const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElDatos, setAnchorElDatos] = useState<null | HTMLElement>(null);
  const [anchorElProductos, setAnchorElProductos] = useState<null | HTMLElement>(null);
  const [anchorElClientes, setAnchorElClientes] = useState<null | HTMLElement>(null);
  const [anchorElGerencia, setAnchorElGerencia] = useState<null | HTMLElement>(null);
  const openDatos = Boolean(anchorElDatos);
  const openProductos = Boolean(anchorElProductos);
  const openClientes = Boolean(anchorElClientes);
  const openGerencia = Boolean(anchorElGerencia);

  const handleOpenDatos = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElDatos(event.currentTarget);
  };

  const handleOpenProductos = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElProductos(event.currentTarget);
  };

  const handleOpenClientes = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElClientes(event.currentTarget);
  };

  const handleOpenGerencia = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElGerencia(event.currentTarget);
  };

  const handleCloseDatos = () => {
    setAnchorElDatos(null);
  };

  const handleCloseProductos = () => {
    setAnchorElProductos(null);
  };

  const handleCloseClientes = () => {
    setAnchorElClientes(null);
  };

  const handleCloseGerencia = () => {
    setAnchorElGerencia(null);
  };

  const handleNavigate = (path: string) => {
    handleCloseDatos();
    handleCloseProductos();
    navigate(path);
  };

  const datos = [
    {
      label: 'Provedor',
      Icon: StorageIcon,
      navigate: 'numeros',
    },
    {
      label: 'Marcas',
      Icon: CategoryIcon,
      navigate: 'marcas',
    },
    {
      label: 'Categorias',
      Icon: CategoryIcon,
      navigate: 'categorias',
    }
  ];

 

  const isDatosActive = location.pathname === '/vendedores' || location.pathname === '/rubros';
  const isProductosActive = location.pathname === '/series';
  const isGerenciaActive = location.pathname === '/gerencial' || location.pathname === '/fallidas';

  return (
    <header className="h-12 pl-20 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 flex items-center justify-between z-10 transition-colors duration-200">
      <div className="flex items-center gap-1.5">
        {/* Menú Desplegable: Datos */}
        <div>
          <button
            id="datos-button"
            aria-controls={openDatos ? 'datos-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openDatos ? 'true' : undefined}
            onClick={handleOpenDatos}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
              openDatos || isDatosActive
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 border border-transparent'
            }`}
          >
            <StorageIcon className="w-4 h-4 text-amber-500" />
            <span>Datos</span>
            <KeyboardArrowDownIcon className={`w-4 h-4 transition-transform duration-200 ${openDatos ? 'rotate-180 text-amber-500' : 'opacity-60'}`} />
          </button>

          <Menu
            id="datos-menu"
            anchorEl={anchorElDatos}
            open={openDatos}
            onClose={handleCloseDatos}
            slotProps={{
              paper: {
                className: '!bg-white dark:!bg-[#1c1c20] !border !border-slate-200/80 dark:!border-zinc-800 !shadow-xl !rounded-xl !mt-1.5 !min-w-[170px] !p-1',
              },
            }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            {datos.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => handleNavigate(item.navigate)}
                className={`rounded-lg! px-3! py-2! text-xs! font-medium! flex! items-center! gap-2.5! transition-colors! ${
                  location.pathname === item.navigate
                    ? 'bg-amber-500/10! text-amber-600! dark:text-amber-400! font-semibold! '
                    : 'text-slate-700! dark:text-zinc-200! hover:bg-slate-100! dark:hover:bg-zinc-800/70!'
                }`}
              >
                <item.Icon className="w-4 h-4 text-amber-500" />
                <span>{item.label}</span>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </header>
  );
};