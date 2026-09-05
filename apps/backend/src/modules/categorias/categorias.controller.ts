import { NextFunction, Request, Response } from "express";
import * as categoriasService from "./categorias.service";
import { actualizarCategoriaSchema, crearCategoriaSchema } from "./categorias.schema";

export const getCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await categoriasService.listarCategorias();
    res.status(200).json({ ok: true, data: categorias });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCategoriaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const categoria = await categoriasService.obtenerCategoriaPorId(Number(id));
    if (!categoria) {
      return res.status(404).json({ ok: false, msg: "Categoría no encontrada" });
    }
    res.status(200).json({ ok: true, data: categoria });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const crearCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = crearCategoriaSchema.parse(req.body);
    const nuevaCategoria = await categoriasService.crearCategoria(data);
    res.status(201).json({ ok: true, msg: "Categoría creada", data: nuevaCategoria });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = actualizarCategoriaSchema.parse(req.body);
    const categoriaActualizada = await categoriasService.actualizarCategoria(Number(id), data);
    if (!categoriaActualizada) {
      return res.status(404).json({ ok: false, msg: "Categoría no encontrada" });
    }
    res.status(200).json({
      ok: true,
      msg: "Categoría actualizada",
      data: categoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const categoriaEliminada = await categoriasService.eliminarCategoria(Number(id));
    if (!categoriaEliminada) {
      return res.status(404).json({ ok: false, msg: "Categoría no encontrada" });
    }
    res.status(200).json({
      ok: true,
      msg: "Categoría eliminada",
      data: categoriaEliminada,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
