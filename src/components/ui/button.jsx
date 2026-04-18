import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-transparent text-primary shadow border-2 border-primary hover:text-golden-accent-dark hover:border-golden-accent-dark hover:brightness-110 active:scale-[0.96] active:brightness-95",
        default:
          "bg-primary text-primary-foreground shadow hover:brightness-115 active:scale-[0.96] active:brightness-90",
        destructive:
          "bg-coral-dark text-white shadow-sm hover:brightness-110 active:scale-[0.96] active:brightness-90",
        outline:
          "border border-input bg-background shadow-sm hover:border-golden-accent-dark hover:text-golden-accent-dark hover:brightness-110 active:scale-[0.96] active:brightness-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:brightness-110 active:scale-[0.96] active:brightness-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.96]",
        link: "text-primary underline-offset-4 hover:underline hover:text-golden-accent-dark",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
