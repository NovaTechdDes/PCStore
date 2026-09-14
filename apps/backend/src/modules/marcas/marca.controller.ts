import { NextFunction, Request, Response } from "express";
import * as marcasService from "./marca.service";
import { crearMarcaSchema, actualizarSchema } from "./marcas.schema";

export const getMarcas = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const soloActivas = req.query.todas !== 'true';
        const marcas =  await marcasService.listarMarcas(soloActivas);
        res.status(200).json({ok: true, data: marcas})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const getMarcaById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const marca = await marcasService.obtenerMarcaPorId(Number(id));
        if (!marca) {
            return res.status(404).json({ok: false, msg: 'Marca no encontrada'})
        }
        res.status(200).json({ok: true, data: marca});
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const crearMarca = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
        const data = crearMarcaSchema.parse(req.body);
        console.log(data)
        const nuevaMarca = await marcasService.crearMarca(data);
        res.status(201).json({ok: true, msg: 'Marca creada', data: nuevaMarca});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putMarca = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = actualizarSchema.parse(req.body);
        const marcaActualizada = await marcasService.actualizarMarca(Number(req.params.id), data);
        if (!marcaActualizada) {
            return res.status(404).json({ok: false, msg: 'Marca no encontrada'});
        }
        res.status(200).json({ok: true, msg: 'Marca actualizada', data: marcaActualizada});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const deleteMarca = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const marcaEliminada = await marcasService.eliminarMarca(Number(id));
        if (!marcaEliminada) {
            return res.status(404).json({ok: false, msg: 'Marca no encontrada'});
        }
        res.status(200).json({ok: true, msg: 'Marca eliminada', data: marcaEliminada});
    } catch (error) {
        console.error(error);
        next(error);
    }
}