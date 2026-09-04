import path from "path";
import { configDotenv } from "dotenv";
import { getPool } from "./config/db";
import app from "./app";

configDotenv({
    path: path.join(__dirname, '../.env')
})

const PORTLOCAL = process.env.PORT || 4000;

getPool().then(() => {
    
    app.listen(PORTLOCAL, () => {
        console.log(`Servidor corriendo en el puerto ${PORTLOCAL} como puerto local`)
    });

}).catch((error) => {
    console.error("❌ Error conectando a SQL Server:", error)
});

