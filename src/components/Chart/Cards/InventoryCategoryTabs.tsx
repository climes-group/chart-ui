import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { sanitizeName } from "./utils";

type InventoryCategoryTabsProps = {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string) => void;
  getSelectedCount: (category: string) => number;
};

export default function InventoryCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  getSelectedCount,
}: Readonly<InventoryCategoryTabsProps>) {
  return (
    <div className="border-border mb-5 flex flex-wrap gap-4 border-b">
      {categories.map((category) => {
        const selectedCount = getSelectedCount(category);
        const isActive = activeCategory === category;

        return (
          <Button
            variant="ghost"
            size="pill"
            key={category}
            onClick={() => onCategoryChange(category)}
            aria-pressed={isActive}
            className={cn(
              "relative shrink-0 rounded-none bg-transparent px-1 pb-2 whitespace-nowrap shadow-none active:scale-100",
              isActive
                ? "text-primary after:bg-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 hover:bg-transparent"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent",
            )}
          >
            {sanitizeName(category)}
            {selectedCount > 0 && (
              <span className="bg-primary/10 text-primary inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-sm font-semibold">
                {selectedCount}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
