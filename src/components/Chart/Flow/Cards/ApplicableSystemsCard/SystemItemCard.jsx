import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function SystemItemCard({ systemItem, isSelected, onToggle }) {
  const sanitizeName = (name) => {
    if (!name) return "N/A";
    return name.replace(/_/g, " ");
  };

  return (
    <Card
      onClick={onToggle}
      className={cn(
        "cursor-pointer transition-all duration-200 border-2 select-none h-full min-w-[160px]",
        isSelected
          ? "border-moss-primary bg-primary/5 shadow-md"
          : "hover:border-muted-foreground/30  bg-card",
      )}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col space-y-1">
            <div className="text-sm">
              {sanitizeName(
                systemItem["ASTMSystemName"] ??
                  systemItem["ASTMName"] ??
                  systemItem["Classification"],
              ) ?? "N/A"}
            </div>

            <small className="text-muted-foreground text-xs">
              {sanitizeName(systemItem["Classification"])}
            </small>
            <small className="text-muted-foreground text-xs">
              {sanitizeName(systemItem["Services"])}
            </small>
            <small className="text-muted-foreground text-xs">
              Code: {sanitizeName(systemItem["ASTMSystemCode"])}
            </small>
          </div>
          {/* Visual Checkbox Indicator */}
          <div
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all",
              isSelected
                ? "bg-moss-primary border-primary"
                : "border-muted-foreground/30",
            )}
          >
            {isSelected && (
              <Check className="h-3 w-3 text-white" strokeWidth={4} />
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {systemItem.desc}
        </p>
      </CardContent>
    </Card>
  );
}

export default SystemItemCard;
