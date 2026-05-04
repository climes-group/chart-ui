import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { BrowserRouter } from "react-router-dom";
import { describe } from "vitest";
import Header from "..";

// mock OidcLogin component
vi.mock("@/components/Auth/OidcLogin");

describe("Header tests", () => {
  // create a wrapper for React Browser Router
  const Wrapper = ({ children }) => {
    return <BrowserRouter>{children}</BrowserRouter>;
  };
  it("should render the Header component", async () => {
    const { findByAltText } = render(<Header />, { wrapper: Wrapper });
    await findByAltText("Climes Logo");
    await findByAltText("Climes Banner");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Header />, { wrapper: Wrapper });
    expect(await axe(container)).toHaveNoViolations();
  });
});
