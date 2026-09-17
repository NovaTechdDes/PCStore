import { Router } from "express";
import {
  crearMarca,
  getMarcas,
  getMarcaById,
  putMarca,
  deleteMarca,
} from "./marca.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get("/", verificarToken, getMarcas);
router.post("/", verificarToken, crearMarca);
router.get("/:id", verificarToken, getMarcaById);
router.put("/:id", verificarToken, putMarca);
router.delete("/:id", verificarToken, deleteMarca);

export default router;
