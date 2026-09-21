import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import { checkUpdate, fetchAssetStream } from "./updates.service";

export const handleCheckUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentVersion = (req.query.currentVersion as string) || "0.0.0";
    const result = await checkUpdate(currentVersion);
    res.status(200).json(result);
  } catch (error) {
    console.error("[Updates Controller] Error al verificar actualización:", error);
    next(error);
  }
};

export const handleDownloadAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assetId } = req.params;

    if (!assetId) {
      res.status(400).json({ message: "Se requiere el ID del asset." });
      return;
    }

    const githubResponse = await fetchAssetStream(assetId);

    const contentLength = githubResponse.headers.get("content-length");
    const contentType =
      githubResponse.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    // Nombre de archivo si viene en query o encabezados
    const fileName = (req.query.fileName as string) || `update-${assetId}.exe`;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );

    if (githubResponse.body) {
      // Convertir Web ReadableStream a Node.js Readable para Express
      const nodeStream = Readable.fromWeb(githubResponse.body as any);
      nodeStream.pipe(res);
    } else {
      res.status(500).json({ message: "No se recibió cuerpo de respuesta de GitHub." });
    }
  } catch (error) {
    console.error("[Updates Controller] Error al descargar asset:", error);
    next(error);
  }
};
