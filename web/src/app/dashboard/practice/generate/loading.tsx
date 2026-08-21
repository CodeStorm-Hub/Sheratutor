import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratePaperLoading() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
