import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Spinner className="size-8" />
        <p className="text-sm">Loading...</p>
      </div>
    </div>
  );
}
