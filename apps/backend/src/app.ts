import express from "express";
import cors from "cors";
import {
  categoriasRoute,
  configuracionRoute,
  marcasRoute,
  movimientosRoute,
  productosRoute,
  provedoresRoute,
  unidadesRoute,
  usuariosRoute,
} from "./modules";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/test", (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "Conexion a la API existosamente",
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/PCStore/marcas", marcasRoute);
app.use("/PCStore/proveedores", provedoresRoute);
app.use("/PCStore/usuarios", usuariosRoute);
app.use("/PCStore/productos", productosRoute);
app.use("/PCStore/categorias", categoriasRoute);
app.use("/PCStore/configuracion", configuracionRoute);
app.use("/PCStore/unidades", unidadesRoute);
app.use("/PCStore/movimientos", movimientosRoute);

app.use(errorHandler);

export default app;
