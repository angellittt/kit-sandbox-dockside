import { RequestHandler } from "express";

export const getHealthcheck: RequestHandler = (_, res) => {
  res
    .status(200)
    .send({ status: "OK", uptime: process.uptime(), timestamp: Date.now() })
    .end();
};
