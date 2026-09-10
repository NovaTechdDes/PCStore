import { NextFunction, Request, Response } from "express";
import { crearMovimientosSchema, filtrosMovimientosSchema } from "./movimientos.schema";
import * as movimientosService from "./movimientos.service";


export const postMovimiento = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearMovimientosSchema.parse(req.body);
        const usuarioId = req.usuario!.id;
        const movimiento = await movimientosService.crearMovimientos(data, usuarioId);
        res.status(201).json({ok: true, data: movimiento})

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getMovimientos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filtros = filtrosMovimientosSchema.parse(req.query);
        const movimientos = await movimientosService.listarMovimientos(filtros);
        res.status(200).json({ok: true, data: movimientos})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const getMovimientosPorId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const movimiento = await movimientosService.obtenerMovimientoPorId(id);
        if(!movimiento){
            return res.status(404).json({ok: false, msg: "Movimiento no encontrado"})
        }

        res.status(200).json({ok: true, data: movimiento})
    } catch (error) {
        console.error(error)
        next(error)
    }
}