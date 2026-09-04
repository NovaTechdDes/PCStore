import { Router } from "express";
import { crearMarca, getMarcas, getMarcaById, putMarca, deleteMarca } from "./marca.controller";

const router = Router();

router.get('/', getMarcas);
router.post('/', crearMarca);
router.get('/:id', getMarcaById);
router.put('/:id', putMarca);
router.delete('/:id', deleteMarca);

export default router;