import { Router } from "express";
import { deleteImagen, putStock, deleteProducto, getProductoPorId, getProductos, postImagen, postProducto, putProducto, getProductoPorCodigoInterno } from "./productos.controller";
import { verificarToken } from "../../middlewares/auth";
import { uploadImagenesProducto } from "../../middlewares/upload";

const router = Router();

router.get('/', getProductos)
router.get('/:id', getProductoPorId)
router.get('/codigoInterno/:codigoInterno', getProductoPorCodigoInterno)

router.post('/',  uploadImagenesProducto.array('imagenes', 6), postProducto);
router.put('/:id', verificarToken, putProducto)
router.delete('/:id', verificarToken, deleteProducto)

router.put('/actualizarStock/:id',  putStock)

router.post(
  "/:id/imagenes",
  verificarToken,
  uploadImagenesProducto.array("imagenes", 6),
  postImagen
);
router.delete("/imagenes/:imagenId", verificarToken, deleteImagen);


export default router;