import { render } from "@testing-library/react";
import { describe } from "vitest";
import Footer from "..";

describe("Footer tests", () => {
  it("should render the Footer component", async () => {
    const { findByLabelText } = render(<Footer />);
    await findByLabelText("Twitter Link");
    await findByLabelText("Linkedin Link");
  });
});
