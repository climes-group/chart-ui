import { useEffect, useEffectEvent, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function ApplicableSystemsCard() {
  const [availableSystems, setAvailableSystems] = useState(null);
  // Track selected system IDs
  const [selectedSystems, setSelectedSystems] = useState(new Set());

  const toggleSystem = (id) => {
    const next = new Set(selectedSystems);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedSystems(next);
  };
  const [error, setError] = useState(null);

  const fetchSystems = useEffectEvent(async () => {
    try {
      const response = await fetch("/api/codes/building_service/v1");
      if (!response.ok) throw new Error("Failed to fetch systems");
      const data = await response.json();
      setAvailableSystems(data);
    } catch (err) {
      setError(err.message);
    }
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!availableSystems) return <div>Loading...</div>;

  const uniqueServices = [
    ...new Set(availableSystems.map((system) => system.Services)),
  ];

  return (
    <div>
      <h2>Applicable Systems</h2>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        {uniqueServices.map((service) => {
          const elementsForService = availableSystems.filter(
            (system) => system.Services === service,
          );
          const selectedCount = elementsForService.filter((element) =>
            selectedSystems.has(element["ASTM.Element.Code"]),
          ).length;

          return (
            <AccordionItem value={service}>
              <AccordionTrigger>
                <div className="flex flex-col mr-2">
                  <span className="font-bold text-lg">{service}</span>
                  {selectedCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-moss-primary hover:bg-moss-primary text-primary-foreground"
                    >
                      {selectedCount} Selected
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {elementsForService.map((element) => (
                    <SystemCard
                      key={element["ASTM.Element.Code"]}
                      system={element}
                      isSelected={selectedSystems.has(
                        element["ASTM.Element.Code"],
                      )}
                      onToggle={() =>
                        toggleSystem(element["ASTM.Element.Code"])
                      }
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function SystemCard({ system, isSelected, onToggle }) {
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
              {system["ASTM.Element"]}
            </h4>
            <small className="text-muted-foreground text-xs">
              Classification: {system["Classification"]}
            </small>

            <small className="text-muted-foreground text-xs">
              Code: {system["ASTM.Element.Code"]}
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
          {system.desc}
        </p>
      </CardContent>
    </Card>
  );
}
