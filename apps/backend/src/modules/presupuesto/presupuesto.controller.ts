import { NextFunction, Request, Response } from "express";
import { createPresupuestoSchema } from "./presupuesto.schema";
import * as presupuestoService from "./presupuesto.service";

export const postPresupuesto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createPresupuestoSchema.parse(req.body);
        const presupuesto = await presupuestoService.createPresupuesto(data, req.usuario!.id);
        if(!presupuesto) {
            return res.status(400).json({ok: false, msg: "Error al crear el presupuesto"});
        }
        return res.status(200).json({ok: true, data: presupuesto})
    } catch (error) {
        console.error(error);
        next(error);
    }
}