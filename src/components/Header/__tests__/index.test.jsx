import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe } from "vitest";
import Header from "..";
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
});
