import React, { useState } from "react";
import { setServerUrl } from "../services/store.service";

export const ServerSetup = ({ onConfigured }: { onConfigured: () => void }) => {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setSaving(true);
      try {
        // Guardar en el archivo de configuración del PC
        await setServerUrl(url.trim());
        onConfigured();
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-[#111113] p-4">
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#18181b] p-8 border border-slate-200 dark:border-zinc-800 rounded-2xl w-96 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-zinc-100">
          Configuración del Servidor
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
          Ingrese la dirección IP o dominio del servidor de 9TECH para conectar
          la base de datos.
        </p>
        <input
          type="text"
          placeholder="Ej: http://192.168.1.100:3000"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm mb-4 dark:text-white"
          required
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm cursor-pointer"
        >
          {saving ? "Guardando..." : "Conectar y Continuar"}
        </button>
      </form>
    </div>
  );
};