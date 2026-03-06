import { RequestHandler } from "express";

export const getHealthcheck: RequestHandler = (_, res) => {
  res.status(200).send({ status: "OK" }).end();
};
