import { cn } from "../cn";
import { buttonVariants } from "@/components/ui/button";

describe("cn", () => {
  test("retains semantic text colors alongside Tailwind font-size utilities", () => {
    expect(cn("text-primary text-sm")).toBe("text-primary text-sm");
  });

  test("retains pill variant colors alongside the compact font-size", () => {
    const pillClasses = cn(
      buttonVariants({ variant: "outline-muted", size: "pill" }),
    );

    expect(pillClasses).toContain("text-muted-foreground");
    expect(pillClasses).toContain("text-sm");
  });
});
