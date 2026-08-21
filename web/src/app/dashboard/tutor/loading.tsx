import { Skeleton } from "@/components/ui/skeleton";

export default function TutorLoading() {
  return (
    <div className="h-full pb-20 md:pb-0 min-h-[26rem]">
      <div className="flex h-full bg-background">
        <div className="hidden md:flex w-72 lg:w-80 shrink-0 border-r border-border flex-col bg-muted/10 p-3 gap-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex-1 flex flex-col min-w-0 items-center justify-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-6 w-56 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
