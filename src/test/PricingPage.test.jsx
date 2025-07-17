import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../contexts/ThemeContext";
import PricingPage from "../components/pages/PricingPage";

const renderPricingPage = () => {
  return render(
    <ThemeProvider>
      <PricingPage />
    </ThemeProvider>,
  );
};

describe("PricingPage", () => {
  it("renders the pricing page content", () => {
    renderPricingPage();
    expect(screen.getByText(/Flexible Pricing for/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Feature Comparison/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ready to Get Started/i).length).toBeGreaterThan(
      0,
    );
  });

  it("shows pricing tabs", () => {
    renderPricingPage();
    expect(screen.getAllByText(/Creator/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Brand/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Agency/i).length).toBeGreaterThan(0);
  });

  it("displays pricing information", () => {
    renderPricingPage();
    expect(screen.getAllByText(/₹/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Free Forever/i).length).toBeGreaterThan(0);
  });
});
