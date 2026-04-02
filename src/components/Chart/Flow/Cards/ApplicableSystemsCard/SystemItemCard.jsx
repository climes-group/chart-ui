import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function sanitizeName(name) {
  if (!name || name === "undefined" || name === "null") return "N/A";
  return name.replace(/_/g, " ");
}

/** Compact toggleable pill for a single building system. */
function SystemPill({ system, isSelected, onToggle }) {
  const name =
    system.ASTMSystemName ?? system.ASTMName ?? system.Classification;

  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-all select-none text-left",
        isSelected
          ? "border-moss-primary bg-moss-primary/5 text-moss-primary font-medium"
          : "border-border text-foreground hover:border-golden-accent/50 hover:bg-warm-gold/10",
      )}
    >
      {/* Checkbox indicator */}
      <span
        className={cn(
          "size-4 rounded-sm border-[1.5px] flex items-center justify-center shrink-0 transition-colors",
          isSelected
            ? "bg-moss-primary border-moss-primary"
            : "border-muted-foreground/30",
        )}
      >
        {isSelected && <Check className="size-2.5 text-white" strokeWidth={3} />}
      </span>

      <span className="leading-snug">{sanitizeName(name)}</span>

      {system.ASTMSystemCode && (
        <span className="text-xs text-warm-brown/70 shrink-0 font-mono">
          {system.ASTMSystemCode}
        </span>
      )}
    </button>
  );
}

export default SystemPill;
