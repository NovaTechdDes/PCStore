import { LazyStore } from "@tauri-apps/plugin-store";

// Creamos un Store persistente en el disco del usuario (se guardará en AppData/Local de manera transparente)
export const appStore = new LazyStore("settings.json");

// Variables en memoria para sincronización síncrona súper veloz en las peticiones Axios
let cachedServerUrl = "";

// Función para inicializar el caché antes de cargar la app
export const initAppStore = async (): Promise<string | null> => {
  try {
    // 1. Intentar cargar desde el store persistente de Tauri
    await appStore.init();
    const saved = await appStore.get<any>("server_url");
    if (saved !== undefined && saved !== null) {
      const url = typeof saved === "string" ? saved : saved.value;
      if (url && typeof url === "string" && url.trim() !== "") {
        cachedServerUrl = url.trim();
        try {
          localStorage.setItem("server_url", cachedServerUrl);
        } catch (_) {}
        return cachedServerUrl;
      }
    }
  } catch (error) {
    console.error("Error cargando store persistente de Tauri:", error);
  }

  // 2. Respaldo inmediato con localStorage si Tauri store aún no cargó o no existe
  try {
    const local = localStorage.getItem("server_url");
    if (local && local.trim() !== "") {
      cachedServerUrl = local.trim();
      // Sincronizar en segundo plano al store de Tauri
      try {
        await appStore.set("server_url", { value: cachedServerUrl });
        await appStore.save();
      } catch (_) {}
      return cachedServerUrl;
    }
  } catch (error) {
    console.error("Error leyendo localStorage:", error);
  }

  return null;
};

// Getter síncrono para Axios
export const getServerUrl = () => cachedServerUrl;

// Setter asíncrono para guardar físicamente
export const setServerUrl = async (url: string) => {
  const cleanUrl = url.trim();
  cachedServerUrl = cleanUrl;

  try {
    localStorage.setItem("server_url", cleanUrl);
  } catch (e) {
    console.warn("No se pudo guardar server_url en localStorage:", e);
  }

  try {
    await appStore.set("server_url", { value: cleanUrl });
    await appStore.save();
  } catch (e) {
    console.warn("No se pudo guardar server_url en Tauri store:", e);
  }
};
