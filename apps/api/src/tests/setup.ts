import { afterAll, beforeAll } from "vitest";
import { closeTestingServer, startTestingServer } from "./utils.js";

beforeAll(async () => {
  await startTestingServer();
});

afterAll(async () => {
  await closeTestingServer();
});
