import { NextFunction, Request, Response } from "express";
import { ajustarStockSchema, crearMovimientosSchema, filtrosMovimientosSchema } from "./movimientos.schema";
import * as movimientosService from "./movimientos.service";


export const postMovimiento = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
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
};

export async function patchAjustarStock(req: Request, res: Response, next: NextFunction) {
  try {
      console.log(req.body)
    const data = ajustarStockSchema.parse(req.body);


    const usuarioId =  req.usuario!.id;


    const movimiento = await movimientosService.ajustarStock(data, usuarioId);
    res.status(200).json({ ok: true, data: movimiento });
  } catch (err) {
    next(err);
  }
}

export const getSeriesDisponibles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productoId = Number(req.params.productoId);
        const series = await movimientosService.listarSeriesDisponibles(productoId);
        res.status(200).json({ ok: true, data: series });
    } catch (error) {
        console.error(error);
        next(error);
    }
};