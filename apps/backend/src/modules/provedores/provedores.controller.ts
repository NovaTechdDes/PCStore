import { NextFunction, Request, Response } from "express";
import * as provedorService from './provedor.service';
import { crearProvedorSchema } from "./provedor.schema";

export const getProvedores = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const soloActiva = req.query.todas !== 'true';
        const provedores = await provedorService.listarProvedores(soloActiva);
        res.status(200).json({ok: true, data: provedores});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getProvedorById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const provedor = await provedorService.obtenerProvedorPorId(Number(id));
        if (!provedor) {
            return res.status(404).json({ok: false, msg: 'Provedor no encontrado'});
        }
        res.status(200).json({ok: true, data: provedor});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const crearProvedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearProvedorSchema.parse(req.body);
        const nuevoProvedor = await provedorService.crearProvedor(data);
        res.status(201).json({ok: true, msg: 'Provedor creado', data: nuevoProvedor});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putProvedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearProvedorSchema.parse(req.body);
        const provedorActualizado = await provedorService.actualizarProvedor(Number(req.params.id), data);
        if (!provedorActualizado) {
            return res.status(404).json({ok: false, msg: 'Provedor no encontrado'});
        }
        res.status(200).json({ok: true, msg: 'Provedor actualizado', data: provedorActualizado});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteProvedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const provedorEliminado = await provedorService.eliminarProvedor(Number(id));
        if (!provedorEliminado) {
            return res.status(404).json({ok: false, msg: 'Provedor no encontrado'});
        }
        res.status(200).json({ok: true, msg: 'Provedor eliminado', data: provedorEliminado});
    } catch (error) {
        console.error(error);
        next(error);
    }
};