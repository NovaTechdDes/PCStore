import  { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useGlobalStore } from '../store';
import { Login } from '../compontents/ui/Login';
import { ServerSetup } from '../pages/App';

const RootLayout = () => {

  const { usuario } = useGlobalStore();
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [hasServerURL, setHasServerURL] = useState(false);

  // Cargar configuración de tauri-plugin-store al iniciar
  useState(() => {
    import('../services/store.service').then(async ({ initAppStore, getServerUrl }) => {
      await initAppStore();
      const url = getServerUrl();

      // Si la URL cargada no es la de por defecto (localhost), está configurada
      if (url && url !== 'http://localhost:3000' && url.trim() !== '') {
        setHasServerURL(true);
      } else {
        // Compatibilidad: ver si había guardado algo distinto de localhost en localStorage
        const saved = localStorage.getItem('server_url');
        if (saved && saved !== 'http://localhost:3000' && saved.trim() !== '') {
          const { setServerUrl } = await import('../services/store.service');
          await setServerUrl(saved);
          setHasServerURL(true);
        } else {
          setHasServerURL(false);
        }
      }
      setLoadingConfig(false);
    });
  });

  if(loadingConfig){
    return(
      <div  className="flex h-screen w-screen items-center justify-center bg-slate-100/80 dark:bg-[#111113]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

   if (!hasServerURL) {
    return <ServerSetup onConfigured={() => setHasServerURL(true)} />;
  }

  if (!usuario) return <Login />;

  return (
    <div>
      {/* Tu Navbar / Layout aquí */}
      <Outlet />
    </div>
  )
}

export default RootLayout