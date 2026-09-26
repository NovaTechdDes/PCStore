import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import { postPresupuesto } from "./presupuesto.controller";

const router = Router();
router.post('/', verificarToken, postPresupuesto);
export default router;