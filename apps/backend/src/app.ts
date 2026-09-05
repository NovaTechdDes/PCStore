import express from "express";
import cors from "cors";
import { marcasRoute, provedoresRoute, usuariosRoute } from "./modules";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();

app.use(cors());
app.use(express.json());

app.use('/test', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: 'Conexion a la API existosamente'
    })
})

app.use('/PCStore/marcas', marcasRoute);
app.use('/PCStore/provedores', provedoresRoute);
app.use('/PCStore/usuarios', usuariosRoute);

app.use(errorHandler);

export default app;