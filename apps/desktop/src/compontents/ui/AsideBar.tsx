import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalStore } from '../../store';
import { getVersion } from '@tauri-apps/api/app';
import packageJson from '../../../package.json';

import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface NavTooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  disabled?: boolean;
}

const NavTooltip = ({ title, children, disabled = false }: NavTooltipProps) => {
  if (disabled) return children;

  return (
    <Tooltip
      title={title}
      placement="right"
      arrow
      enterDelay={100}
      leaveDelay={50}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 12],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            bgcolor: 'rgb(24, 24, 27)', // zinc-900
            color: 'rgb(244, 244, 245)', // zinc-100
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            px: 1.5,
            py: 0.75,
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.45), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgb(63, 63, 70)', // zinc-700
            '& .MuiTooltip-arrow': {
              color: 'rgb(24, 24, 27)',
              '&::before': {
                border: '1px solid rgb(63, 63, 70)',
              },
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

const AsideBar = () => {
  const location = useLocation();
  const { setUsuario, usuario } = useGlobalStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aside_collapsed') === 'true';
    }
    return false;
  });

  const [appVersion, setAppVersion] = useState<string>(packageJson.version);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem('aside_collapsed', String(nextState));
      return nextState;
    });
  };

  useEffect(() => {
    getVersion()
      .then((ver) => setAppVersion(ver))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogOut = () => {
    setUsuario(null);
  };

  const isActive = (path: string) => {
    if (path === '/ventas') {
      return location.pathname === '/ventas' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  const navItems = [
    {
      to: '/ventas',
      label: 'Ventas',
      Icon: SellIcon,
      active: isActive('/ventas'),
      badge: '1 Item',
    },
    {
      to: '/clientes',
      label: 'Clientes',
      Icon: PeopleIcon,
      active: isActive('/clientes'),
    },
    {
      to: '/productos',
      label: 'Productos',
      Icon: InventoryIcon,
      active: isActive('/productos'),
    },
    {
      to: '/cajas',
      label: 'Cajas',
      Icon: AccountBalanceIcon,
      active: isActive('/cajas'),
    },
    {
      to: '/recibos',
      label: 'Recibos',
      Icon: AccountBalanceIcon,
      active: isActive('/recibos'),
    },
    {
      to: '/cuenta',
      label: 'Cuentas Corrientes',
      Icon: AccountBalanceIcon,
      active: isActive('/cuenta'),
    },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between h-[calc(100vh-3rem)] bg-slate-50 dark:bg-[#111113] border-r border-slate-200/80 dark:border-zinc-800/80 transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-17.5' : 'w-64'
      }`}
    >
      {/* Sección Superior: Header y Navegación */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Cabecera del Sidebar con botón de colapsar/expandir */}
        <div className={`py-3 px-3.5 border-b border-slate-200/70 dark:border-zinc-800/70 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">Menú Lateral</span>
              <NavTooltip title="Ocultar barra" disabled={false}>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 dark:text-zinc-500 dark:hover:text-amber-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
                  aria-label="Ocultar barra"
                >
                  <KeyboardArrowLeftIcon className="w-5 h-5" />
                </button>
              </NavTooltip>
            </>
          ) : (
            <NavTooltip title="Expandir menú" disabled={false}>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 dark:text-zinc-500 dark:hover:text-amber-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
                aria-label="Expandir menú"
              >
                <KeyboardArrowRightIcon className="w-5 h-5" />
              </button>
            </NavTooltip>
          )}
        </div>

        {/* Menú de Navegación */}
        <div className="p-2.5 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden">
          {usuario?.Rol === 'admin' &&
            navItems.map((item) => (
              <NavTooltip
                key={item.to}
                title={
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{item.badge}</span>}
                  </div>
                }
                disabled={!isCollapsed}
              >
                <Link
                  to={item.to}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                    isCollapsed ? 'justify-center w-11 h-11 mx-auto' : 'gap-3 px-3.5 py-2.5 w-full'
                  } ${
                    item.active
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-medium shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <item.Icon
                    className={`w-5 h-5 transition-colors duration-200 shrink-0 ${
                      item.active ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">{item.badge}</span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-50 dark:ring-[#111113]" />}
                </Link>
              </NavTooltip>
            ))}
        </div>
      </div>

      {/* Sección Inferior: Perfil del Usuario y Acciones */}
      <div className="p-2.5 border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-100/40 dark:bg-zinc-900/30">
        {/* Información del Usuario */}
        {isCollapsed ? (
          <NavTooltip
            title={
              <div className="py-0.5">
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Operador</p>
                <p className="font-semibold text-zinc-100">{usuario?.NombreUsuario || 'Usuario'}</p>
                <p className="text-[10px] text-amber-400 font-mono capitalize">{usuario?.Rol || 'Usuario'}</p>
              </div>
            }
            disabled={!isCollapsed}
          >
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500 text-white font-bold text-xs uppercase shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-500/40 transition-all">
              {usuario?.NombreUsuario ? usuario.NombreUsuario.substring(0, 2) : 'U'}
            </div>
          </NavTooltip>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2.5 rounded-xl bg-slate-200/40 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800/60">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs uppercase shadow-xs shrink-0">
              {usuario?.NombreUsuario ? usuario.NombreUsuario.substring(0, 2) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Operador</p>
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 truncate">{usuario?.NombreUsuario || 'Usuario'}</p>
            </div>
          </div>
        )}

        {/* Botón de Cambio de Tema */}
        <NavTooltip title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} disabled={!isCollapsed}>
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-zinc-700/60 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 transition-all duration-200 cursor-pointer ${
              isCollapsed ? 'justify-center w-10 h-10 mx-auto mb-1.5' : 'justify-between w-full px-3.5 py-2 mb-1.5'
            }`}
            aria-label="Cambiar tema"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <LightModeIcon className="w-4 h-4 text-amber-400 shrink-0" /> : <DarkModeIcon className="w-4 h-4 text-slate-600 dark:text-zinc-400 shrink-0" />}
              {!isCollapsed && <span className="text-xs font-medium">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
            </div>
          </button>
        </NavTooltip>

        {/* Botón de Cerrar Sesión */}
        <NavTooltip title="Cerrar sesión" disabled={!isCollapsed}>
          <button
            type="button"
            onClick={handleLogOut}
            className={`flex items-center rounded-xl border border-transparent hover:border-red-500/20 text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer ${
              isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'justify-between w-full px-3.5 py-2'
            }`}
            aria-label="Cerrar sesión"
          >
            <div className="flex items-center gap-3">
              <LogoutIcon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="text-xs font-medium">Cerrar sesión</span>}
            </div>
          </button>
        </NavTooltip>

        {/* Versión de la App */}
        {isCollapsed ? (
          <NavTooltip title={`Versión ${appVersion}`} disabled={!isCollapsed}>
            <div className="mt-2 text-center cursor-default">
              <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-600 block">v{appVersion}</span>
            </div>
          </NavTooltip>
        ) : (
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600">v{appVersion}</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AsideBar;
