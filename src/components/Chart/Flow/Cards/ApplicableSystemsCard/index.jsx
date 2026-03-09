import { useEffect, useEffectEvent, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addSelectedSystem,
  removeSelectedSystem,
} from "@/state/slices/reportReducer";
import { Breadcrumbs, Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SystemItemCard from "./SystemItemCard";

function sanitizeName(name) {
  return name.replace("_", " ");
}

function getItemKey(element) {
  return `${element["Services"]}-${element["Classification"]}-${element["ASTM.Name"]}-${element["ASTM.System.Name"]}`;
}

export default function ApplicableSystemsCard() {
  const [availableSystems, setAvailableSystems] = useState(null);
  const dispatch = useDispatch();
  // Track open accordions
  const [openService, setOpenService] = useState(null);
  const [openClassification, setOpenClassification] = useState(null);
  const selectedSystems = useSelector((state) => state.report.selectedSystems);

  /** Toggle system selection */
  const toggleSystem = (id) => {
    if (selectedSystems.has(id)) {
      dispatch(removeSelectedSystem(id));
    } else {
      console.log("Current systems before adding:", selectedSystems);
      console.log("Adding system:", id);
      dispatch(addSelectedSystem(id));
    }
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
      {/* Sticky breadcrumbs for open accordions */}
      <div className="sticky top-0 z-20 bg-background mb-2 flex justify-end">
        <Breadcrumbs aria-label="current selection" className="list-none">
          {openService && (
            <Link href={`#trigger-svc-${openService}`}>
              {sanitizeName(openService)}
            </Link>
          )}
          {openClassification && (
            <Link href={`#trigger-class-${openClassification}`}>
              {sanitizeName(openClassification)}
            </Link>
          )}
        </Breadcrumbs>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
        onValueChange={(value) => {
          setOpenService(value || null);
          setOpenClassification(null); // Reset classification when service changes
        }}
      >
        {uniqueServices.map((service) => {
          const elementsForService = availableSystems.filter(
            (system) => system.Services === service,
          );
          const uniqueClassificationsInService = [
            ...new Set(elementsForService.map((el) => el.Classification)),
          ];

          const selectedServiceCount = elementsForService.filter((element) => {
            const itemKey = getItemKey(element);
            return selectedSystems.has(itemKey);
          }).length;

          return (
            <AccordionItem value={service} className="border-b-2" key={service}>
              <AccordionTrigger id={`trigger-svc-${service}`}>
                <div className="flex gap-2 mr-2">
                  <span className="font-bold text-lg">
                    {sanitizeName(service)}
                  </span>
                  {selectedServiceCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-moss-primary hover:bg-moss-primary text-primary-foreground"
                    >
                      {selectedServiceCount} Selected
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full mx-4"
                  onValueChange={(value) =>
                    setOpenClassification(value || null)
                  }
                >
                  {uniqueClassificationsInService.map((uniqueClass) => {
                    const elementsInClass = elementsForService.filter(
                      (el) => el.Classification === uniqueClass,
                    );

                    const selectedClassCount = elementsInClass.filter(
                      (element) => {
                        const itemKey = getItemKey(element);
                        return selectedSystems.has(itemKey);
                      },
                    ).length;

                    return (
                      <AccordionItem className="border-b-0" value={uniqueClass}>
                        <AccordionTrigger
                          id={`trigger-class-${uniqueClass}`}
                          className="flex gap-2 mr-2"
                        >
                          <h3 className="text-md">
                            {sanitizeName(uniqueClass)}
                          </h3>
                          {selectedClassCount > 0 && (
                            <Badge
                              variant="default"
                              className="bg-moss-primary hover:bg-moss-primary text-primary-foreground"
                            >
                              {selectedClassCount} Selected
                            </Badge>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {elementsInClass.map((element) => {
                              const itemKey = getItemKey(element);
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
