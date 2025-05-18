import { renderWithProviders } from "@/utils/testing";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import AccountControls from "../AccountControls";

describe("AccountControls tests", () => {
  it("should render a login button when no profile", async () => {
    renderWithProviders(<AccountControls />, {
      preloadedState: {
        profile: undefined,
      },
    });
    await screen.findByText("Login");
  });

  it("should render a profile button when profile is present", async () => {
    renderWithProviders(<AccountControls />, {
      preloadedState: {
        user: {
          profile: {
            given_name: "John",
            email: "test@test.com",
          },
        },
      },
    });
    await screen.findByText("John");
  });

  it("should render a profile button with email as title", async () => {
    const expectedEmail = "john@test.com";
    renderWithProviders(<AccountControls />, {
      preloadedState: {
        user: {
          profile: {
            given_name: "John",
            email: expectedEmail,
          },
        },
      },
    });
    const button = await screen.findByText("John");
    expect(button).toHaveAttribute("title", `Logged in as ${expectedEmail}`);
  });
});
