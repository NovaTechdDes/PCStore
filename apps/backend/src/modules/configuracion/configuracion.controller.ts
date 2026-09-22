import { NextFunction, Request, Response } from "express";
import * as configuracionService from "./configuracion.service";
import {
  actualizarConfiguracionSchema,
  actualizarValorDolarSchema,
} from "./configuracion.schema";

export const getConfiguraciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configuraciones = await configuracionService.listarConfiguracion();
    res.status(200).json({ ok: true, data: configuraciones });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getValorDolar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dolarConfig = await configuracionService.obtenerValorDolar();
    res.status(200).json({ ok: true, data: dolarConfig });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putValorDolar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = actualizarValorDolarSchema.parse(req.body);
    const resultado = await configuracionService.actualizarValorDolar(
      data.valor,
      data.recalcularPrecios
    );
    res.status(200).json({
      ok: true,
      msg: `Valor del dólar actualizado correctamente a $${data.valor}${
        data.recalcularPrecios
          ? `. Se recalcularon los precios de ${resultado.productosAfectados} producto(s).`
          : ""
      }`,
      data: resultado,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getConfiguracionPorClave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clave } = req.params;
    const config = await configuracionService.obtenerConfiguracionPorClave(String(clave));
    if (!config) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró la configuración '${clave}'`,
      });
    }
    res.status(200).json({ ok: true, data: config });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putConfiguracion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clave } = req.params;
    const data = actualizarConfiguracionSchema.parse(req.body);
    const configActualizada = await configuracionService.actualizarValorClave(String(clave), data.valor);
    res.status(200).json({
      ok: true,
      msg: `Configuración '${clave}' actualizada`,
      data: configActualizada,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
