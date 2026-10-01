import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import { getPresupuestoById, postPresupuesto } from "./presupuesto.controller";

const router = Router();

router.get('/:id', getPresupuestoById);
router.post('/', verificarToken, postPresupuesto);

export default router;