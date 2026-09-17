import { NextFunction, Request, Response } from "express";
import * as proveedorService from './provedor.service';
import { crearProveedorSchema } from "./provedor.schema";

export const getProveedores = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const soloActiva = req.query.todas !== 'true';
        const proveedores = await proveedorService.listarProveedores(soloActiva);
        res.status(200).json({ok: true, data: proveedores});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getProveedorById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const proveedor = await proveedorService.obtenerProveedorPorId(Number(id));
        if (!proveedor) {
            return res.status(404).json({ok: false, msg: 'Proveedor no encontrado'});
        }
        res.status(200).json({ok: true, data: proveedor});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const crearProveedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearProveedorSchema.parse(req.body);
        const nuevoProveedor = await proveedorService.crearProveedor(data);
        res.status(201).json({ok: true, msg: 'Proveedor creado', data: nuevoProveedor});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putProveedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearProveedorSchema.parse(req.body);
        const proveedorActualizado = await proveedorService.actualizarProveedor(Number(req.params.id), data);
        if (!proveedorActualizado) {
            return res.status(404).json({ok: false, msg: 'Proveedor no encontrado'});
        }
        res.status(200).json({ok: true, msg: 'Proveedor actualizado', data: proveedorActualizado});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteProveedor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const proveedorEliminado = await proveedorService.eliminarProveedor(Number(id));
        if (!proveedorEliminado) {
            return res.status(404).json({ok: false, msg: 'Proveedor no encontrado'});
        }
        res.status(200).json({ok: true, msg: 'Proveedor eliminado', data: proveedorEliminado});
    } catch (error) {
        console.error(error);
        next(error);
    }
};