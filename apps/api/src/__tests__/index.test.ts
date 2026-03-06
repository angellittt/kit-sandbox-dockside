import { afterAll, describe, expect, test } from "vitest";
import axios from "axios";
import { startServer } from "../app.js";
import { getAddress } from "../utils/index.js";
import { ServerConfig } from "../types/index.js";

describe("API tests", async () => {
  const config: ServerConfig = {
    port: 8001,
    host: "0.0.0.0",
  };
  const server = await startServer(config);
  test("healthcheck works", async () => {
    const address = getAddress(server);
    const { status, data } = await axios.get(`${address}/api/v1/healthcheck`);
    expect(status).toBe(200);
    expect(data).toEqual({ status: "OK" });
  });
  afterAll(() => {
    server.close();
  });
});
