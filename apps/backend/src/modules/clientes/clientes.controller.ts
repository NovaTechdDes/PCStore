import { NextFunction, Request, Response } from "express";
import * as clientesService from "./clientes.service";
import { filtrosProductoSchema } from "../productos/productos.schema";
import { actualizarClienteSchema, crearClienteSchema } from "./clientes.schema";

export const getClientes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filtros = filtrosProductoSchema.parse(req.query);
        const clientes = await clientesService.clientesFiltrados(filtros);
        res.status(200).json({ok: true, data: clientes})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const getClientePorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const cliente = await clientesService.obtenerClientePorId(id);
        if(!cliente){
            return res.status(404).json({ok: false, msg: 'Cliente no encontrado'})
        }

        res.status(200).json({ok: true, data: cliente})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const postCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearClienteSchema.parse(req.body);
        const cliente = await clientesService.crearCliente(data);
        res.status(201).json({ok: true, data: cliente})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const putCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const data = actualizarClienteSchema.parse(req.body);
        const cliente = await clientesService.actualizarCliente(id, data);
        if(!cliente){
            return res.status(404).json({ok: false, msg: 'Cliente no encontrado'})
        }

        res.status(200).json({ok: true, data: cliente})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const deleteCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const cliente = await clientesService.eliminarCliente(id);
        if(!cliente){
            return res.status(404).json({ok: false, msg: 'Cliente no encontrado'})
        }

        res.status(200).json({ok: true, data: cliente})
    } catch (error) {
        console.error(error);
        next(error)
    }
};