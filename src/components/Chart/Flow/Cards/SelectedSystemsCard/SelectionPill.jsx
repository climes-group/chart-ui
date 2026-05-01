import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function SelectionPill({ name, code, isSelected, onToggle, ref, ...props }) {
  return (
    <button
      ref={ref}
      onClick={onToggle}
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm transition-all select-none",
        isSelected
          ? "border-primary bg-primary/5 text-primary font-medium"
          : "border-border text-foreground hover:border-golden-accent/50 hover:bg-warm-gold/10",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm border-[1.5px] transition-colors",
          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30",
        )}
      >
        {isSelected && <Check className="size-2.5 text-white" strokeWidth={3} />}
      </span>

      <span className="leading-snug">{name}</span>

      {code && (
        <span className="text-warm-brown shrink-0 font-mono text-xs">{code}</span>
      )}
    </button>
  );
}
