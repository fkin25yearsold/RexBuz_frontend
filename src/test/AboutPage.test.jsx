import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "../contexts/ThemeContext";
import AboutPage from "../components/pages/AboutPage";

const renderAboutPage = () => {
  return render(
    <ThemeProvider>
      <AboutPage />
    </ThemeProvider>,
  );
};

describe("AboutPage", () => {
  it("renders the about page content", () => {
    renderAboutPage();
    expect(
      screen.getByText(/Empowering Bharat's Creator Economy/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Meet the Faces Behind Influbazzar/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Our Impact in Numbers/i)).toBeInTheDocument();
  });

  it("shows team members", () => {
    renderAboutPage();
    expect(screen.getByText(/Ajay Babu Yadavalli/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Co-Founder & CEO/i).length).toBeGreaterThan(0);
  });

  it("displays impact metrics", () => {
    renderAboutPage();
    expect(screen.getAllByText(/₹/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Paid to Creators/i)).toBeInTheDocument();
  });
});
