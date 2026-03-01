import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/store/hooks";
import { LOADING_GLOBAL } from "@/lib/constants/loading.constants";

interface GlobalLoadingProps {
  watch?: string[];
}

export function GlobalLoading({
  watch = [LOADING_GLOBAL],
}: GlobalLoadingProps) {
  const activeLoadings = useAppSelector(
    (state) => state.storeLoading.activeLoadings,
  );
  const isActive = watch.some((id) => activeLoadings.includes(id));

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-busy
      aria-label="Loading"
    >
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}
