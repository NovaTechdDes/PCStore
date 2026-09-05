import { NextFunction, Request, Response } from "express";
import * as usuariosService from './usuario.service'
import { actualizarUsuarioSchema, cambiarPasswordSchema, crearUsuarioSchema, loginSchema } from "./usuarios.schema";

export const getUsuarios = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const soloActivos = req.query.todos !== "true";
        const usuarios = await usuariosService.listarUsuarios(soloActivos);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error)
        next(error);
    }
};

export const getUsuarioById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const usuario = await usuariosService.obtenerUsuarioPorId(id)

        if(!usuario){
            return  res.status(404).json({ ok: true, data: null, msg: "Usuario no encontrado"})
        }

        return res.status(200).json({ok: true, data: usuario})
    } catch (error) {
        console.error(error)
        next(error)
    }
};

export const postUsuario = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = crearUsuarioSchema.parse(req.body);
        const usuario = await usuariosService.crearUsuario(data);
        res.status(201).json({ ok: true, data: usuario });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putUsuario = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const data = actualizarUsuarioSchema.parse(req.body);
        const usuario = await usuariosService.actualizarUsuario(id, data);

        if(!usuario){
            return res.status(404).json({ok: true, data: null, msg: 'Usuario no encontrado'})
        }

        res.status(200).json({ ok: true, data: usuario });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


export const deleteUsuario = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const usuario = await usuariosService.eliminarUsuario(id);
        if(!usuario){
            return res.status(404).json({ok: false, msg: 'Usuario no encontrado'})
        }
        res.status(200).json({ ok: true, data: usuario });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const patchPassword = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const data = cambiarPasswordSchema.parse(req.body);
        const resultado = await usuariosService.cambiarPassword(id, data.passwordActual, data.passwordNueva);
        res.status(200).json({ ok: true, data: resultado });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const postLogin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = loginSchema.parse(req.body);
        const resultado = await usuariosService.login(data);
        res.status(200).json({ ok: true, data: resultado });
    } catch (error) {
        console.error(error);
        next(error);
    }
}