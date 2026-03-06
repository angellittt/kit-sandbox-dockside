import express from "express";
import { Router } from "express";
import cors from "cors";
import { healthcheckRouter } from "./healthcheck.js";

export const apiRouter: Router = Router();

apiRouter.use(cors());
apiRouter.use(express.json({ limit: "50mb" }));
apiRouter.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }),
);

apiRouter.use("/healthcheck", healthcheckRouter);
