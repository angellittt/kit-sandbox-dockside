import { Router } from "express";
import { getHealthcheck } from "../controllers/healthcheck.js";

export const healthcheckRouter: Router = Router();

healthcheckRouter.get("/", getHealthcheck);

const main = async () => {
  fetch("").then((res) => {
    const result = res.json();
    console.log(result);
  });
};
