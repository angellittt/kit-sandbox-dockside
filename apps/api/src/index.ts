import { startServer } from "./app.js";
import { ServerConfig } from "./types/index.js";

const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const host = process.env.HOST ?? "0.0.0.0";

const config: ServerConfig = {
  port,
  host,
};

const main = async () => {
  try {
    await startServer(config);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

main();
