import { useState, MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StorageIcon from '@mui/icons-material/Storage';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import CategoryIcon from '@mui/icons-material/Category';

export const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElDatos, setAnchorElDatos] = useState<null | HTMLElement>(null);

  const openDatos = Boolean(anchorElDatos);

  const handleOpenDatos = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElDatos(event.currentTarget);
  };

  const handleCloseDatos = () => {
    setAnchorElDatos(null);
  };

  const handleNavigate = (path: string) => {
    handleCloseDatos();
    navigate(path);
  };

  const datos = [
    {
      label: 'Provedor',
      Icon: StorageIcon,
      navigate: 'proveedores',
    },
    {
      label: 'Marcas',
      Icon: BrandingWatermarkIcon,
      navigate: 'marcas',
    },
    {
      label: 'Categorias',
      Icon: CategoryIcon,
      navigate: 'categorias',
    },
  ];

  const isDatosActive = location.pathname === '/vendedores' || location.pathname === '/rubros';

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
