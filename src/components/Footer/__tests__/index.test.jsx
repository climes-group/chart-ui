import { render } from "@testing-library/react";
import { describe } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Footer from "..";

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("Footer tests", () => {
  it("renders the footer component", () => {
    render(<Footer />, { wrapper });
  });

  it("renders navigation links", () => {
    const { getByRole } = render(<Footer />, { wrapper });
    expect(getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Start CHART" })).toBeInTheDocument();
  });

  it("renders social links", async () => {
    const { findByLabelText } = render(<Footer />, { wrapper });
    await findByLabelText("Twitter Link");
    await findByLabelText("Linkedin Link");
  });

  it("renders the copyright notice", () => {
    const { getByText } = render(<Footer />, { wrapper });
    expect(getByText(/Climes Group Engineering Inc/)).toBeInTheDocument();
  });
});
