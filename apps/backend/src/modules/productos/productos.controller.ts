import { NextFunction, Request, Response } from "express";
import { actualizarProductoSchema, actualizarStockSchema, crearProductoSchema, filtrosProductoSchema } from "./productos.schema";
import * as productosService from "./productos.service";

export const getProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filtros = filtrosProductoSchema.parse(req.query);
        const productos = await productosService.listarProductos(filtros);
        res.status(200).json({ok: true, data:productos});
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const getProductoPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const producto = await productosService.obtenerProductoPorId(id);
        if(!producto){
            return res.status(404).json({ok: false, msg: "Producto no encontrado"})
        }

        res.status(200).json({ok: true, data: producto});
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const postProducto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = {...req.body};
        if(typeof body.caracteristicas === "string"){
            body.caracteristicas = JSON.parse(body.caracteristicas);
        };

        const data = crearProductoSchema.parse(body);
        const archivos = (req.files as Express.Multer.File[]) ?? [];
        const producto = await productosService.crearProducto(data, archivos);
        res.status(201).json({ok: true, data: producto});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putProducto = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const id = Number(req.params.id);
        const data =  actualizarProductoSchema.parse(req.body);
        const producto = await productosService.actualizarProducto(id, data);

        if(!producto){
            return res.status(404).json({
                ok: false, msg: "Producto No encontrado"
            });
        };

        res.status(200).json({
            ok: true, data: producto
        })
        
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const putStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const data = actualizarStockSchema.parse(req.body);
        console.log('Data', data)
        const producto = await productosService.actualizarStock(data);

        if(!producto){
            return res.status(404).json({
                ok: false, msg: "Producto No Encontrado"
            })
        };

        res.status(200).json({
            ok: true, msg: "Stock actualizado correctamente"
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const deleteProducto = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const producto = await productosService.eliminarProducto(id);
        if(!producto){
            return res.status(404).json({ok: false, msg: 'Producto no encontrado'})
        }

        res.status(200).json({ok: true, data: producto})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const postImagen = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const archivos = (req.files as Express.Multer.File[]) ?? [];
        if(archivos.length === 0){
            return res.status(400).json({ok: false, msg: "No se enviaron imagenes"})
        }

        const producto = await productosService.agregarImagenes(id, archivos);
        res.status(200).json({ok: true, data: producto})
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const deleteImagen = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const imagenId = Number(req.params.imagenId);
        await productosService.eliminarImagen(imagenId);
        res.status(200).json({ok: true, msg: 'Imagen eliminada correctamente'})
    } catch (error) {
        console.error(error);
        next(error)
    }
};