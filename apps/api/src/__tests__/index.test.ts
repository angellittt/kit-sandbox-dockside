import { describe, expect, test } from "vitest";
import { getTestAddress } from "../tests/utils.js";
import axios from "axios";

describe("API tests", async () => {
  test("healthcheck works", async () => {
    const { status, data } = await axios.get(
      `${getTestAddress()}/api/v1/healthcheck`,
    );
    expect(status).toBe(200);
    expect(data).toEqual({ status: "OK" });
  });
});
