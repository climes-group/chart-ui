import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function SystemItemCard({ systemItem, isSelected, onToggle }) {
  return (
    <Card
      onClick={onToggle}
      className={cn(
        "cursor-pointer transition-all duration-200 border-2 select-none h-full",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "hover:border-muted-foreground/30 border-transparent bg-card",
      )}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col space-y-1">
            <h4
              className={cn(
                "font-semibold leading-tight transition-colors",
                isSelected ? "text-primary" : "text-card-foreground",
              )}
            >
              {systemItem["ASTM.Element"]}
            </h4>
            <small className="text-muted-foreground text-xs">
              Classification: {systemItem["Classification"]}
            </small>
            <small className="text-muted-foreground text-xs">
              System.Name: {systemItem["ASTM.System.Name"]}
            </small>
            <small className="text-muted-foreground text-xs">
              System.Elements: {systemItem["System.Elements"]}
            </small>
            <small className="text-muted-foreground text-xs">
              Code: {systemItem["ASTM.Element.Code"]}
            </small>
          </div>
          {/* Visual Checkbox Indicator */}
          <div
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all",
              isSelected
                ? "bg-primary border-primary"
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
