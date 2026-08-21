import { Skeleton } from "@/components/ui/skeleton";

export default function SubmissionsLoading() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
