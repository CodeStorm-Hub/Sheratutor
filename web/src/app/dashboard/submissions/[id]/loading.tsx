import { Skeleton } from "@/components/ui/skeleton";

export default function SubmissionDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <Skeleton className="h-32 w-full rounded-r-2xl" />

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-full" />
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}
