import { expect, test } from "vitest";
import { app } from "../index.js";

// This test is temporary and will be completely replaced in the next PR. I'm just adding here for to test coverage report
test("healthcheck works", async () => {
  app;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(500);
  const response = await fetch("http://localhost:8000/");
  const json = await response.json();
  expect(json.message).toBe("Server is running!");
  expect(response.status).toBe(200);
});
