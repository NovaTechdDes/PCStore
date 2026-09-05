import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "productos");

if(!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, {recursive: true})
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, nombreUnico);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const extValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mimeValido = tiposPermitidos.test(file.mimetype);

    if(extValida && mimeValido){
        cb(null, true);
    }else{
        cb(new Error("Solo se permiten imagenes JPG, PNG o WEBP"))
    }
};

export const uploadImagenesProducto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }, // 5MB por archivo, máx 6 imágenes
});