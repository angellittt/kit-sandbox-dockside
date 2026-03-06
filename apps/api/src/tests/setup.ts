import { afterAll, beforeAll } from "vitest";

beforeAll(() => {
  console.log("Starting api tests...");
});

afterAll(() => {
  console.log("Api tests finished");
});
