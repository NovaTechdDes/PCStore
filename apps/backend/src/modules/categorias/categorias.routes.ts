import { Router } from "express";
import {
  crearCategoria,
  deleteCategoria,
  getCategoriaById,
  getCategorias,
  putCategoria,
} from "./categorias.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get("/", getCategorias);
router.get("/:id", getCategoriaById);

router.post("/", verificarToken, crearCategoria);
router.put("/:id", verificarToken, putCategoria);
router.delete("/:id", verificarToken, deleteCategoria);

export default router;
