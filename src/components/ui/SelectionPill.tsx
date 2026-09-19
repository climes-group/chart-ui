import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Check, CircleQuestionMarkIcon } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "name"> & {
  name: string;
  code?: string;
  isSelected?: boolean;
  showInfoIcon?: boolean;
  onToggle?: (e: MouseEvent<HTMLButtonElement>) => void;
};

const SelectionPill = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      code,
      isSelected,
      showInfoIcon = false,
      onToggle,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        variant="option"
        size="pill"
        ref={ref}
        role="option"
        aria-selected={isSelected}
        {...props}
        onClick={(e) => {
          onClick?.(e);
          onToggle?.(e);
        }}
        className={cn(
          "select-none",
          isSelected
            ? "border-primary bg-primary/5 text-primary font-medium"
            : "border-border text-foreground hover:border-secondary/50 hover:bg-accent/10",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border-[1.5px] leading-none transition-colors",
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground/30",
          )}
        >
          {isSelected && (
            <Check className="text-primary-foreground size-2.5" strokeWidth={3} />
          )}
        </span>

        <span className="leading-none">{name}</span>

        {showInfoIcon && (
          <span
            aria-hidden="true"
            data-info-icon="true"
            className="flex size-4 shrink-0 items-center justify-center leading-none"
          >
            <CircleQuestionMarkIcon
              size="1rem"
              strokeWidth={2}
              color="currentColor"
            />
          </span>
        )}
      </Button>
    );
  },
);
SelectionPill.displayName = "SelectionPill";

export default SelectionPill;
