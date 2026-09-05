import { Router } from "express";
import {
  getConfiguracionPorClave,
  getConfiguraciones,
  getValorDolar,
  putConfiguracion,
  putValorDolar,
} from "./configuracion.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

// Rutas específicas primero para evitar colisión con :clave
router.get("/dolar", getValorDolar);
router.put("/dolar", verificarToken, putValorDolar);

// Rutas generales
router.get("/", verificarToken, getConfiguraciones);
router.get("/:clave", verificarToken, getConfiguracionPorClave);
router.put("/:clave", verificarToken, putConfiguracion);

export default router;
