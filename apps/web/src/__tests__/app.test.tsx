import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { describe, expect, it } from "vitest";

describe("App", () => {
  it("should render a button", () => {
    render(<App />);
    screen.getByRole("button", { name: /increment/i });
  });
  it("should increment count on button click", async () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /increment/i });
    const count = screen.getByTestId("count");
    expect(count.textContent).toBe("0");
    const user = userEvent.setup();
    await user.click(button);
    expect(count.textContent).toBe("1");
    expect(button).toBeInTheDocument();
  });
});
