import { Request, Response, NextFunction } from "express";
import { checkUpdate, getAssetDownloadUrl } from "./updates.service";

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

    const downloadUrl = await getAssetDownloadUrl(assetId);
    return res.redirect(downloadUrl);
  } catch (error) {
    console.error("[Updates Controller] Error al descargar asset:", error);
    next(error);
  }
};

