import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Check } from "lucide-react";

import { Button } from "../button";

describe("Button", () => {
  test("renders the shared semantic variants and sizes", () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
        <Button variant="stepper">Step</Button>
        <Button size="icon" aria-label="Confirm">
          <Check />
        </Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass(
      "border-primary",
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass(
      "bg-surface",
    );
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "bg-destructive",
      "h-9",
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveClass(
      "h-10",
      "w-10",
    );
    expect(screen.getByRole("button", { name: "Step" })).toHaveClass(
      "hover:bg-transparent",
      "active:scale-100",
    );
  });

  test("preserves disabled semantics and does not invoke the handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
