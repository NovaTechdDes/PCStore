import path from "path";
import { configDotenv } from "dotenv";
import { getPool } from "./config/db";
import app from "./app";
import { inicializarUsuarioAdmin, inicializarUsuarioParticn } from "./modules/usuarios/usuario.service";
import { inicializarDatosPorDefecto } from "./utils/seed";

configDotenv({
    path: path.join(__dirname, '../.env')
})

const PORTLOCAL = process.env.PORT || 4000;

getPool().then(async () => {
    await inicializarUsuarioAdmin();
    await inicializarUsuarioParticn();
    await inicializarDatosPorDefecto();

    app.listen(PORTLOCAL, () => {
        console.log(`Servidor corriendo en el puerto ${PORTLOCAL} como puerto local`)
    });

}).catch((error) => {
    console.error("❌ Error conectando a SQL Server:", error)
});

