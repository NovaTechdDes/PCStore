import  { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useGlobalStore } from '../store';
import { Login } from '../compontents/ui/Login';
import { ServerSetup } from '../pages/App';
import { getServerUrl, initAppStore } from '../services';
import { TopNavbar } from '../compontents';
import AsideBar from '../compontents/ui/AsideBar';

const RootLayout = () => {

  const { usuario } = useGlobalStore();
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [hasServerURL, setHasServerURL] = useState(false);

  // Cargar configuración de tauri-plugin-store al iniciar
  useEffect(() => {
    let isMounted = true;

    const checkConfiguration = async () => {
      try {
        const savedUrl = await initAppStore();
        const url = savedUrl || getServerUrl();

        if (url && url.trim() !== '') {
          if (isMounted) setHasServerURL(true);
        } else {
          if (isMounted) setHasServerURL(false);
        }
      } catch (error) {
        console.error('Error inicializando la configuración:', error);
        if (isMounted) setHasServerURL(false);
      } finally {
        if (isMounted) setLoadingConfig(false);
      }
    };
    checkConfiguration();

    return () => {
      isMounted = false;
    };
  }, []);

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
      <TopNavbar />
      {/* Tu Navbar / Layout aquí */}
      <div className='flex'>
        <AsideBar/>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default RootLayout