import { render } from "@testing-library/react";
import { describe } from "vitest";
import ApplicableSystemsCard from "../ApplicableSystemsCard";

describe("ApplicableSystems tests", () => {
  it("should render the ApplicableSystems component", () => {
    render(<ApplicableSystemsCard />);
  });
});
