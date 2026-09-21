import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import { postVenta } from "./ventas.controller";

const router = Router();

router.post('/', verificarToken, postVenta);

export default router;