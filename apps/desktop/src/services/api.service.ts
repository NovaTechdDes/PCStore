import axios from "axios";
import { getServerUrl } from "./store.service";

const api = axios.create();

api.interceptors.request.use((config) => {
  const serverURL = getServerUrl();
  config.baseURL = `${serverURL}/PCStore/`;
  return config;
});

export default api;
