import { Router } from "express";
import * as usuariosController from "./usuarios.controller";
import { verificarRol, verificarToken } from "../../middlewares/auth";


const router = Router();

router.post('/login', usuariosController.postLogin);

//Protegido: Require estar logueado
router.get('/', verificarToken, usuariosController.getUsuarios);
router.get('/:id', verificarToken, usuariosController.getUsuarioById);
router.patch('/:id/password', verificarToken, usuariosController.patchPassword);

//Protegido: Solo Admin
router.post('/', verificarToken, verificarRol('admin'), usuariosController.postUsuario);
router.put('/:id', verificarToken, verificarRol('admin'), usuariosController.putUsuario);
router.delete('/:id', verificarToken, verificarRol('admin'), usuariosController.deleteUsuario);

export default router;
