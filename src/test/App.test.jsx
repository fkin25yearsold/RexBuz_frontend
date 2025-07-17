import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the navbar with logo", () => {
    render(<App />);
    expect(screen.getByText("influ")).toBeInTheDocument();
    expect(screen.getByText("bazzar")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/Connect\. Collaborate\. Grow\./i),
    ).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    render(<App />);
    expect(screen.getAllByLabelText(/toggle theme/i).length).toBeGreaterThan(0);
  });

  it("displays platform stats section", () => {
    render(<App />);
    expect(screen.getByText(/Platform Live Stats/i)).toBeInTheDocument();
  });

  it("shows the trending campaigns section", () => {
    render(<App />);
    expect(screen.getByText(/Trending Campaigns/i)).toBeInTheDocument();
  });
});
