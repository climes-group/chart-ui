import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
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
      code: _code,
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
        aria-pressed={isSelected}
        {...props}
        onClick={(e) => {
          onClick?.(e);
          onToggle?.(e);
        }}
        className={cn(
          "group hover:bg-muted/60 w-full min-w-0 justify-start border-transparent bg-transparent px-2 text-left select-none hover:border-transparent",
          isSelected
            ? "bg-primary/5 text-primary hover:bg-primary/10 font-medium"
            : "text-muted-foreground",
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
            <Check className="text-primary-foreground" strokeWidth={2} />
          )}
        </span>

        <span className="min-w-0 flex-1 truncate leading-none">{name}</span>

        {showInfoIcon && (
          <span
            aria-hidden="true"
            data-info-icon="true"
            className="text-muted-foreground/70 group-hover:text-muted-foreground flex size-4 shrink-0 items-center justify-center leading-none transition-colors"
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
