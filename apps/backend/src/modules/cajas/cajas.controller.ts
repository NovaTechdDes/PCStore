import { NextFunction, Request, Response } from "express";
import { filtrosCajaSchema } from "./caja.schema";
import * as cajaService from './cajas.service';

export const getCaja = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filtros = filtrosCajaSchema.parse(req.query);
        const data = await cajaService.obtenerCajaPorFecha(filtros);
        res.status(200).json({
            ok: true, 
            data
        });
    } catch (error) {
        console.error("Error al obtener ventas de caja: ", error);
        next(error);
    }
}