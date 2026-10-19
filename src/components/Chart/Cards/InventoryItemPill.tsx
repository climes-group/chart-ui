import SelectionPill from "@/components/ui/SelectionPill";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type InventoryItemPillProps = {
  name: string;
  code?: string;
  isSelected: boolean;
  description: string;
  onToggle: () => void;
  tabIndex?: number;
};

export default function InventoryItemPill({
  name,
  code,
  isSelected,
  description,
  onToggle,
  tabIndex,
}: Readonly<InventoryItemPillProps>) {
  const pill = (
    <SelectionPill
      name={name}
      code={code}
      isSelected={isSelected}
      showInfoIcon={Boolean(description)}
      onToggle={onToggle}
      tabIndex={tabIndex}
    />
  );

  if (!description) return pill;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{pill}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}
