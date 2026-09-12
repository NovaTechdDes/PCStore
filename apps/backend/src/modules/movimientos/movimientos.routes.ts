import { Router } from "express";
import { getMovimientos, getMovimientosPorId, patchAjustarStock, postMovimiento } from "./movimientos.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get('/', verificarToken, getMovimientos);
router.get('/:id', verificarToken, getMovimientosPorId);

router.post('/', verificarToken, postMovimiento);

router.patch("/ajuste-stock", patchAjustarStock);

export default router