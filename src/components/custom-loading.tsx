import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { LOADING_GLOBAL } from "@/lib/constants/loading.constants";
import clsx from "clsx";

interface CustomLoadingProps {
  /** Loading IDs to watch (same as GlobalLoading). Shows when any is active. */
  watch?: string[];
  /** Optional class for the overlay container (e.g. rounded-lg to match parent). */
  className?: string;
}

/**
 * Same loading UI as GlobalLoading but positioned relative to its parent.
 * The parent container must have `position: relative` and a defined size
 * so the overlay fills it (e.g. `relative h-64` or `relative min-h-[200px]`).
 */
export function CustomLoading({
  watch = [LOADING_GLOBAL],
  className = "",
}: CustomLoadingProps) {
  const activeLoadings = useAppSelector(
    (state) => state.storeLoading.activeLoadings,
  );
  const isActive = watch.some((id) => activeLoadings.includes(id));

  if (!isActive) return null;

  return (
    <div
      className={clsx(
        `absolute inset-0 z-10 flex items-center justify-center bg-background/10 backdrop-blur-sm py-4 rounded-md`,
        className,
      )}
      aria-busy
      aria-label="Loading"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
