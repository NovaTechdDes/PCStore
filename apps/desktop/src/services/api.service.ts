import axios from "axios";
import { getServerUrl } from "./store.service";
import { useGlobalStore } from "../store";

const api = axios.create();



api.interceptors.request.use((config) => {
  const serverURL = getServerUrl();
  config.baseURL = `${serverURL}/PCStore/`;

  // 1. Obtenemos el suuari logueado directamente del store
  const usuario = useGlobalStore.getState().usuario;

  if(usuario){
    // 2. Si tu backend Valdiad con JWT
    if(usuario.token){
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }

    
  }
  return config;
});

export default api;
