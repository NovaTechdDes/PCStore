import { Router } from "express";
import {
  handleCheckUpdate,
  handleDownloadAsset,
} from "./updates.controller";

const router = Router();

router.get("/check", handleCheckUpdate);
router.get("/download/:assetId", handleDownloadAsset);

export default router;
