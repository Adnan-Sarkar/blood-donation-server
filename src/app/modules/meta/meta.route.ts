import express from "express";
import auth from "../../middleware/auth";
import { MetaController } from "./meta.controller";

const metaRouter = express.Router();

metaRouter.get("/", auth("USER"), MetaController.getMetaInfo);

metaRouter.get("/admin/", auth("ADMIN", "SUPER_ADMIN"), MetaController.getAdminMetadata);

export const MetaRoute = metaRouter;
