import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
    console.error(err);

    if(err instanceof ZodError){
        return res.status(400).json({
            ok: false,
            msg: 'Error de validacion',
            errores: err.issues.map((e) => ({
                campo: e.path.join("."),
                mensaje: e.message,
            }))
        })
    };

    if (err.status) {
        return res.status(err.status).json({
            ok: false,
            msg: err.msg || 'Error en la solicitud'
        });
    }

    res.status(500).json({
        ok: false,
        msg: 'Error interno en el servidor'
    })


}