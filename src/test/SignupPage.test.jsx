import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ThemeProvider } from "../contexts/ThemeContext";
import SignupPage from "../components/pages/SignupPage";

// Mock fetch for API calls
global.fetch = vi.fn();

const renderSignupPage = () => {
  return render(
    <ThemeProvider>
      <SignupPage />
    </ThemeProvider>,
  );
};

describe("SignupPage", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders signup form with all required fields", () => {
    renderSignupPage();

    // Check for form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/terms and conditions/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Submit without filling fields
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/date of birth is required/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("validates email format", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const emailInput = screen.getByLabelText(/email address/i);

    // Enter invalid email
    await user.type(emailInput, "invalid-email");
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  test("validates phone number format", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const phoneInput = screen.getByLabelText(/phone number/i);

    // Enter invalid phone number
    await user.type(phoneInput, "123");
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/phone number must be exactly 10 digits/i),
      ).toBeInTheDocument();
    });
  });

  test("validates password strength", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const passwordInput = screen.getByLabelText(/^password/i);

    // Enter weak password
    await user.type(passwordInput, "weak");
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i),
      ).toBeInTheDocument();
    });
  });

  test("validates password confirmation", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const passwordInput = screen.getByLabelText(/^password/i);
    const repeatPasswordInput = screen.getByLabelText(/repeat password/i);

    // Enter different passwords
    await user.type(passwordInput, "StrongPass123!");
    await user.type(repeatPasswordInput, "DifferentPass123!");
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test("validates age requirement", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const dobInput = screen.getByLabelText(/date of birth/i);

    // Enter date for someone under 18
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() - 16);
    const dateString = futureDate.toISOString().split("T")[0];

    await user.type(dobInput, dateString);
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/you must be at least 18 years old/i),
      ).toBeInTheDocument();
    });
  });

  test("enables submit button when form is valid", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    // Fill all fields with valid data
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.type(
      screen.getByLabelText(/email address/i),
      "john@example.com",
    );
    await user.type(screen.getByLabelText(/^password/i), "StrongPass123!");
    await user.type(
      screen.getByLabelText(/repeat password/i),
      "StrongPass123!",
    );
    await user.click(screen.getByLabelText(/terms and conditions/i));

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test("formats phone number with spaces", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const phoneInput = screen.getByLabelText(/phone number/i);

    // Type phone number
    await user.type(phoneInput, "9876543210");

    // Check if it's formatted with space
    expect(phoneInput.value).toBe("98765 43210");
  });

  test("shows password strength meter", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const passwordInput = screen.getByLabelText(/^password/i);

    // Enter password to show strength meter
    await user.type(passwordInput, "Str");

    // Check if strength meter is visible
    await waitFor(() => {
      expect(screen.getByText(/requirements/i)).toBeInTheDocument();
    });
  });

  test("calls API on form submission", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "123",
        email: "john@example.com",
        full_name: "John Doe",
      }),
    });

    renderSignupPage();

    // Fill form with valid data
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.type(
      screen.getByLabelText(/email address/i),
      "john@example.com",
    );
    await user.type(screen.getByLabelText(/^password/i), "StrongPass123!");
    await user.type(
      screen.getByLabelText(/repeat password/i),
      "StrongPass123!",
    );
    await user.click(screen.getByLabelText(/terms and conditions/i));

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Check if API was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://bc282d8d0e2.ngrok-free.app/api/v1/auth/signup",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.stringContaining("john@example.com"),
        }),
      );
    });
  });

  test("handles API errors gracefully", async () => {
    const user = userEvent.setup();

    // Mock API error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        detail: "Email already registered",
      }),
    });

    renderSignupPage();

    // Fill form with valid data
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.type(
      screen.getByLabelText(/email address/i),
      "john@example.com",
    );
    await user.type(screen.getByLabelText(/^password/i), "StrongPass123!");
    await user.type(
      screen.getByLabelText(/repeat password/i),
      "StrongPass123!",
    );
    await user.click(screen.getByLabelText(/terms and conditions/i));

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Check if error is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/email is already registered/i),
      ).toBeInTheDocument();
    });
  });

  test("shows success message on successful signup", async () => {
    const user = userEvent.setup();

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "123",
        email: "john@example.com",
        full_name: "John Doe",
      }),
    });

    renderSignupPage();

    // Fill form with valid data
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/date of birth/i), "1990-01-01");
    await user.type(
      screen.getByLabelText(/email address/i),
      "john@example.com",
    );
    await user.type(screen.getByLabelText(/^password/i), "StrongPass123!");
    await user.type(
      screen.getByLabelText(/repeat password/i),
      "StrongPass123!",
    );
    await user.click(screen.getByLabelText(/terms and conditions/i));

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Check if success message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/account created successfully/i),
      ).toBeInTheDocument();
    });
  });

  test("theme toggle works correctly", async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const themeToggle = screen.getByRole("button", { name: /toggle theme/i });

    // Click theme toggle
    await user.click(themeToggle);

    // Check if dark class is applied to document
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
