import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import {
  getProvedores,
  getProvedorById,
  crearProvedor,
  putProvedor,
  deleteProvedor,
} from "./provedores.controller";

const router = Router();

router.get("/", getProvedores);
router.post("/", verificarToken, crearProvedor);
router.get("/:id", getProvedorById);
router.put("/:id", verificarToken, putProvedor);
router.delete("/:id", verificarToken, deleteProvedor);

export default router;
