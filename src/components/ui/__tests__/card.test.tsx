import { render, screen } from "@testing-library/react";

import { Card } from "../card";

describe("Card", () => {
  test("uses the opaque semantic surface token", () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText("Card content")).toHaveClass(
      "bg-surface",
      "text-foreground",
      "shadow-card",
    );
    expect(screen.getByText("Card content")).not.toHaveClass("bg-card");
  });
});
