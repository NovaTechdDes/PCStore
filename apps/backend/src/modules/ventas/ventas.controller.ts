import { NextFunction, Request, Response } from "express";
import "../../middlewares/auth";
import { createVentaSchema } from "./ventas.schema";
import * as ventasService from "./ventas.service";

export const postVenta = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
        const data = createVentaSchema.parse(req.body);
        const venta = await ventasService.createVenta(data, req.usuario!.id);
        if(!venta){
            return res.status(400).json({ok: false, msg: "Error al crear la venta"})
        }

        res.status(200).json({ok: true, data: venta})
    } catch (error) {
        console.error(error);
        next(error)
    }
}