import { Skeleton } from "@/components/ui/skeleton";

export default function TutorLoading() {
  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-11rem)] md:h-[calc(100vh-4rem)] min-h-[26rem]">
      <div className="flex h-full border border-border rounded-xl overflow-hidden bg-card">
        <div className="hidden md:flex w-64 shrink-0 border-r border-border flex-col bg-muted/20 p-3 gap-2">
          <Skeleton className="h-8 w-full rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-3 border-b border-border flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-16 w-2/3 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
