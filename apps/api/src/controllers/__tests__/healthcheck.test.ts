import { describe, expect, test } from "vitest";
import { getTestAddress } from "../../tests/utils.js";
import axios from "axios";

describe("API tests", async () => {
  test("healthcheck works", async () => {
    const { status, data } = await axios.get(
      `${getTestAddress()}/api/v1/healthcheck`,
    );
    expect(status).toBe(200);
    const { uptime, timestamp, status: healthStatus } = data;
    expect(healthStatus).toBe("OK");
    expect(typeof uptime).toBe("number");
    expect(typeof timestamp).toBe("number");
  });
});
