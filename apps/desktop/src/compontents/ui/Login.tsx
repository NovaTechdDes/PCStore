import React, {  useState } from "react";
import { useGlobalStore } from "../../store";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import logoProar from "../../assets/Logo.PNG";
import { login } from "../../services";

export const Login = () => {
  const { setUsuario } = useGlobalStore();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await login(password);
      
      if (res) {
        setUsuario({
          Id: res.Id,
          NombreUsuario: res.NombreUsuario,
          Rol: res.Rol,
          token: res.token,
        });
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#111113] p-4 transition-colors duration-250">
      <div className="w-full max-w-md bg-white dark:bg-[#18181b] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl dark:shadow-2xl/50 overflow-hidden">
        {/* Header / Branding */}
        <div className="p-8 text-center border-b border-slate-100 dark:border-zinc-800/50 flex flex-col items-center">
          <img
            src={logoProar}
            alt="PROAR Logo"
            className="w-32 h-auto mb-2 object-contain"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-wider text-slate-500 dark:text-zinc-400 uppercase mb-2">
              Acceso al Sistema
            </label>
            <div className="relative flex items-center">
              <LockOutlinedIcon className="absolute left-3.5 text-slate-400 dark:text-zinc-500 text-lg pointer-events-none" />
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900/60 text-slate-800 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <span>{loading ? "Iniciando sesión..." : "Iniciar Sesión"}</span>
            {!loading && <ArrowForwardIcon className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="py-4 px-8 bg-slate-50/50 dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-800/50 text-center">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Gestión Interna — PROAR
          </p>
        </div>
      </div>
    </div>
  );
};