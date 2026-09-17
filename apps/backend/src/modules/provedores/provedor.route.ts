import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import {
  getProveedores,
  getProveedorById,
  crearProveedor,
  putProveedor,
  deleteProveedor,
} from "./provedores.controller";

const router = Router();

router.get("/", verificarToken, getProveedores);
router.post("/", verificarToken, crearProveedor);
router.get("/:id", verificarToken, getProveedorById);
router.put("/:id", verificarToken, putProveedor);
router.delete("/:id", verificarToken, deleteProveedor);

export default router;
