import { Router } from "express";
import { getMovimientos, getMovimientosPorId, getSeriesDisponibles, patchAjustarStock, postMovimiento } from "./movimientos.controller";
import { verificarToken } from "../../middlewares/auth";

const router = Router();

router.get('/', verificarToken, getMovimientos);
router.get('/:id', verificarToken, getMovimientosPorId);
router.get("/series/:productoId", verificarToken, getSeriesDisponibles);

router.post('/', verificarToken, postMovimiento);

router.patch("/ajuste-stock", verificarToken, patchAjustarStock);

export default router