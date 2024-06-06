import express from "express";
import auth from "../../middleware/auth";
import { MetaController } from "./meta.controller";

const metaRouter = express.Router();

metaRouter.get("/", auth("USER"), MetaController.getMetaInfo);

export const MetaRoute = metaRouter;
