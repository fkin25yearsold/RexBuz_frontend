import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../contexts/ThemeContext";
import Navbar from "../components/navigation/Navbar";

const renderNavbar = () => {
  return render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>,
  );
};

describe("Navbar", () => {
  it("renders the navbar structure", () => {
    renderNavbar();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("influ")).toBeInTheDocument();
    expect(screen.getByText("bazzar")).toBeInTheDocument();
  });

  it("has essential navigation elements", () => {
    renderNavbar();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Solutions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sign Up").length).toBeGreaterThan(0);
  });

  it("has theme toggle functionality", () => {
    renderNavbar();
    expect(screen.getAllByLabelText(/toggle theme/i).length).toBeGreaterThan(0);
  });

  it("has mobile menu functionality", () => {
    renderNavbar();
    expect(
      screen.getByRole("button", { name: /open main menu/i }),
    ).toBeInTheDocument();
  });

  it("shows solutions mega menu when clicked", () => {
    renderNavbar();
    const solutionsButtons = screen.getAllByText("Solutions");
    fireEvent.click(solutionsButtons[0]); // Click first Solutions button

    // Check if mega menu content appears
    expect(screen.getByText("For Creators")).toBeInTheDocument();
    expect(screen.getByText("For Brands")).toBeInTheDocument();
    expect(screen.getByText("For Agencies")).toBeInTheDocument();
  });
});
