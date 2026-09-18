import { Router } from "express";
import { deleteImagen, deleteProducto, getProductoPorId, getProductos, postImagen, postProducto, putProducto, getProductoPorCodigoInterno, getProductoVenta } from "./productos.controller";
import { verificarToken } from "../../middlewares/auth";
import { uploadImagenesProducto } from "../../middlewares/upload";

const router = Router();

router.get('/', verificarToken, getProductos)
router.get('/:id', verificarToken, getProductoPorId)
router.get('/codigoInterno/:codigoInterno', verificarToken, getProductoPorCodigoInterno)
router.get('/venta/:codigo', verificarToken, getProductoVenta)

router.post('/', verificarToken, uploadImagenesProducto.array('imagenes', 6), postProducto);
router.put('/:id', verificarToken, putProducto)
router.delete('/:id', verificarToken, deleteProducto)

router.post(
  "/:id/imagenes",
  verificarToken,
  uploadImagenesProducto.array("imagenes", 6),
  postImagen
);
router.delete("/imagenes/:imagenId", verificarToken, deleteImagen);


export default router;