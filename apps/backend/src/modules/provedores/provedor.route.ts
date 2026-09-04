import { Router } from "express";
import { getProvedores, getProvedorById, crearProvedor, putProvedor, deleteProvedor } from "./provedores.controller";

const router = Router();

router.get('/', getProvedores);
router.post('/', crearProvedor);
router.get('/:id', getProvedorById);
router.put('/:id', putProvedor);
router.delete('/:id', deleteProvedor);

export default router;