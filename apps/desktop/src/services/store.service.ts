import { LazyStore } from "@tauri-apps/plugin-store";

// Creamos un Store persistente en el disco del usuario (se guardará en AppData/Local de manera transparente)
export const appStore = new LazyStore("settings.json");

// Variables en memoria para sincronización síncrona súper veloz en las peticiones Axios
let cachedServerUrl = "http://localhost:3000";

// Función para inicializar el caché antes de cargar la app
export const initAppStore = async () => {
  try {
    const saved = await appStore.get<{ value: string }>("server_url");
    if (saved) {
      cachedServerUrl = saved.value;
    }
  } catch (error) {
    console.error("Error cargando el store persistente:", error);
  }
};

// Getter síncrono para Axios
export const getServerUrl = () => cachedServerUrl;

// Setter asíncrono para guardar físicamente
export const setServerUrl = async (url: string) => {
  cachedServerUrl = url;
  await appStore.set("server_url", { value: url });
  await appStore.save();
};
