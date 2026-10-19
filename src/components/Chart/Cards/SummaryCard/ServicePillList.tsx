import { CircleQuestionMarkIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sanitizeName } from "../utils";

type ServicePillListProps = {
  groups: Record<string, { name: string; description: string }[]>;
};

export default function ServicePillList({
  groups,
}: Readonly<ServicePillListProps>) {
  const services = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  return (
    <TooltipProvider>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service}>
            <p className="heading-label mb-1.5">{sanitizeName(service)}</p>
            <div className="flex flex-wrap gap-1.5">
              {groups[service].map(({ name, description }, index) => {
                const pill = (
                  <span
                    key={`${name}-${index}`}
                    className="border-border bg-muted/40 text-foreground inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-sm"
                  >
                    <span className="min-w-0 break-words">{name}</span>
                    {description && (
                      <CircleQuestionMarkIcon
                        aria-hidden="true"
                        className="text-muted-foreground size-4 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                  </span>
                );

                if (!description) return pill;

                return (
                  <Tooltip key={`${name}-${index}`}>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>{pill}</span>
                    </TooltipTrigger>
                    <TooltipContent>{description}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
