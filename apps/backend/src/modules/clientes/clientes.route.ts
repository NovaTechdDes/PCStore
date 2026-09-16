import { Router } from "express";
import { getClientes, getClientePorId, postCliente, putCliente, deleteCliente } from "./clientes.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get('/', verificarToken, getClientes);
router.get('/:id', verificarToken, getClientePorId);

router.post('/', verificarToken, postCliente);
router.put('/:id', verificarToken, putCliente);
router.delete('/:id', verificarToken, deleteCliente);

export default router;