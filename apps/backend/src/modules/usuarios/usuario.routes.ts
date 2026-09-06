import { Router } from "express";
import {
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  patchPassword,
  postLogin,
  postUsuario,
  putUsuario,
} from "./usuarios.controller";
import { verificarRol, verificarToken } from "../../middlewares/auth";

const router = Router();

router.post("/login", postLogin);

//Protegido: Require estar logueado
router.get("/", verificarToken, getUsuarios);
router.get("/:id", verificarToken, getUsuarioById);
router.patch("/:id/password", verificarToken, patchPassword);

//Protegido: Solo Admin
router.post("/", postUsuario);
router.put("/:id", verificarToken, verificarRol("admin"), putUsuario);
router.delete("/:id", verificarToken, verificarRol("admin"), deleteUsuario);

export default router;
