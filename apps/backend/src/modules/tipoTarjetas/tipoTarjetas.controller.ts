import { NextFunction, Request, Response } from "express";
import * as tipoTarjetasService from "./tipoTarjetas.service";
import {
  actualizarTipoTarjetaSchema,
  crearTipoTarjetaSchema,
} from "./tipoTarjetas.schema";

export const getTiposTarjeta = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const soloActivas = req.query.todas !== "true";
    const data = await tipoTarjetasService.listarTiposTarjeta(soloActivas);
    res.status(200).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTipoTarjetaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await tipoTarjetasService.obtenerTipoTarjetaPorId(Number(id));

    if (!data) {
      return res
        .status(404)
        .json({ ok: false, msg: "Tipo de tarjeta no encontrado" });
    }

    res.status(200).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const postTipoTarjeta = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = crearTipoTarjetaSchema.parse(req.body);
    const nuevoTipo = await tipoTarjetasService.crearTipoTarjeta(data);
    res.status(201).json({
      ok: true,
      msg: "Tipo de tarjeta creado exitosamente",
      data: nuevoTipo,
    });
  } catch (error) {
    next(error);
  }
};

export const putTipoTarjeta = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = actualizarTipoTarjetaSchema.parse(req.body);
    const tipoActualizado = await tipoTarjetasService.actualizarTipoTarjeta(
      Number(id),
      data
    );

    res.status(200).json({
      ok: true,
      msg: "Tipo de tarjeta actualizado exitosamente",
      data: tipoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTipoTarjeta = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const tipoEliminado = await tipoTarjetasService.eliminarTipoTarjeta(
      Number(id)
    );

    res.status(200).json({
      ok: true,
      msg: "Tipo de tarjeta desactivado exitosamente",
      data: tipoEliminado,
    });
  } catch (error) {
    next(error);
  }
};
