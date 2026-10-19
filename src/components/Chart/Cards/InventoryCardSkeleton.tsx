import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-6 w-44 rounded" />
      <div className="border-border flex flex-wrap gap-2 border-b pb-3">
        {[88, 112, 80].map((width) => (
          <Skeleton
            key={width}
            className="h-9 rounded-full"
            style={{ width }}
          />
        ))}
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-3 w-20 rounded" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[96, 124, 80, 144, 100, 116].map((width, index) => (
            <Skeleton
              key={`${width}-${index}`}
              className="h-9 w-full rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
