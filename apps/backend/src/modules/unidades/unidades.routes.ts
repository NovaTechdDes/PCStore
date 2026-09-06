import { Router } from "express";
import {
  crearUnidad,
  deleteUnidad,
  getUnidadById,
  getUnidades,
  putUnidad,
} from "./unidades.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get("/", getUnidades);
router.get("/:id", getUnidadById);

router.post("/", verificarToken, crearUnidad);
router.put("/:id", verificarToken, putUnidad);
router.delete("/:id", verificarToken, deleteUnidad);

export default router;
