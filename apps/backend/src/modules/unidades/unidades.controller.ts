import { NextFunction, Request, Response } from "express";
import * as unidadesService from "./unidades.service";
import { actualizarUnidadSchema, crearUnidadSchema } from "./unidades.schema";

export const getUnidades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unidades = await unidadesService.listarUnidades();
    res.status(200).json({ ok: true, data: unidades });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUnidadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const unidad = await unidadesService.obtenerUnidadPorId(Number(id));
    if (!unidad) {
      return res.status(404).json({ ok: false, msg: "Unidad de medida no encontrada" });
    }
    res.status(200).json({ ok: true, data: unidad });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const crearUnidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = crearUnidadSchema.parse(req.body);
    const nuevaUnidad = await unidadesService.crearUnidad(data);
    res.status(201).json({ ok: true, msg: "Unidad de medida creada", data: nuevaUnidad });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putUnidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = actualizarUnidadSchema.parse(req.body);
    const unidadActualizada = await unidadesService.actualizarUnidad(Number(req.params.id), data);
    if (!unidadActualizada) {
      return res.status(404).json({ ok: false, msg: "Unidad de medida no encontrada" });
    }
    res.status(200).json({ ok: true, msg: "Unidad de medida actualizada", data: unidadActualizada });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUnidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const unidadEliminada = await unidadesService.eliminarUnidad(Number(id));
    if (!unidadEliminada) {
      return res.status(404).json({ ok: false, msg: "Unidad de medida no encontrada" });
    }
    res.status(200).json({ ok: true, msg: "Unidad de medida eliminada", data: unidadEliminada });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
