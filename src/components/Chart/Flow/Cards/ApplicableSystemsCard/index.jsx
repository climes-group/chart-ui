import { useEffect, useEffectEvent, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@mui/material";
import SystemItemCard from "./SystemItemCard";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/codes/building_services/ref`,
      );
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
  if (!availableSystems)
    return (
      <div className="flex flex-col space-y-3">
        <h2>Applicable Systems</h2>
        <Skeleton className="h-[60px] w-full rounded-xl" />
        <Skeleton className="h-[60px] w-full rounded-xl" />
        <Skeleton className="h-[60px] w-full rounded-xl" />
        <Skeleton className="h-[60px] w-full rounded-xl" />
        <Skeleton className="h-[60px] w-full rounded-xl" />
      </div>
    );

  const uniqueServices = [
    ...new Set(availableSystems.map((system) => system.Services)),
  ];

  return (
    <div>
      <h2>Applicable Systems</h2>
      <Breadcrumbs
        aria-label="applicable systems"
        className="mb-4 sticky top-0 bg-background z-10"
      >
        {uniqueServices.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </Breadcrumbs>
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
          const uniqueClassificationsInService = [
            ...new Set(elementsForService.map((el) => el.Classification)),
          ];

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
                <Accordion type="single" collapsible className="w-full mx-4">
                  {uniqueClassificationsInService.map((uniqueClass) => {
                    const elementsInClass = elementsForService.filter(
                      (el) => el.Classification === uniqueClass,
                    );
                    console.log(
                      "Elements in class",
                      uniqueClass,
                      elementsInClass,
                    );
                    return (
                      <AccordionItem value={uniqueClass}>
                        <AccordionTrigger>
                          <h3 className="text-md">{uniqueClass}</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {elementsInClass.map((element) => {
                              const itemKey = `${element["Services"]}-${element["Classification"]}-${element["ASTM.Name"]}-${element["ASTM.System.Name"]}`;
                              return (
                                <SystemItemCard
                                  key={itemKey}
                                  systemItem={element}
                                  isSelected={selectedSystems.has(itemKey)}
                                  onToggle={() => toggleSystem(itemKey)}
                                />
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
