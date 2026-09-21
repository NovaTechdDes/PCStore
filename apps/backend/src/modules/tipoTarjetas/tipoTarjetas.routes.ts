import { Router } from "express";
import {
  getTiposTarjeta,
  getTipoTarjetaById,
  postTipoTarjeta,
  putTipoTarjeta,
  deleteTipoTarjeta,
} from "./tipoTarjetas.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get("/", verificarToken, getTiposTarjeta);
router.get("/:id", verificarToken, getTipoTarjetaById);
router.post("/", verificarToken, postTipoTarjeta);
router.put("/:id", verificarToken, putTipoTarjeta);
router.delete("/:id", verificarToken, deleteTipoTarjeta);

export default router;
