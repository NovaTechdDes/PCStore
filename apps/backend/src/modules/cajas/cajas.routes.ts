import { Router } from "express";
import { verificarToken } from "../../middlewares/auth";
import { getCaja } from "./cajas.controller";

const router = Router();

router.get('/', verificarToken, getCaja);


export default router