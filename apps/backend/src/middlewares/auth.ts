import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  id: number;
  nombreUsuario: string;
  rol: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, msg: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, msg: "Token inválido o expirado" });
  }
}

export function verificarRol(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ ok: false, msg: "No tenés permisos para esta acción" });
    }
    next();
  };
}