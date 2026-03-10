import { Server } from "http";
import express from "express";
import { ServerConfig } from "./types/index.js";
import { checkPortAvailable, getAddress } from "./utils/index.js";
import { apiRouter } from "./routes/index.js";

export const createApp = (): express.Express => {
  const app = express();
  app.use("/api/v1", apiRouter);
  return app;
};

export const startServer = async (config: ServerConfig) => {
  await checkPortAvailable(config.port, config.host);

  const app = createApp();
  return new Promise<Server>((resolve, reject) => {
    const server = app.listen(
      config.port,
      config.host,
      async (error?: Error) => {
        if (error) {
          reject(error);
        }
        const address = getAddress(server);
        // TODO: Install logger and replace console.log
        console.log(`Ready at ${address}`);
        resolve(server);
      },
    );
  });
};
const x = () => {};

x();
