import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/checkout": "Checkout",
  "/tracking": "Tracking",
};

export function SiteHeader() {
  const { pathname } = useLocation();
  const currentLabel = routeLabels[pathname] ?? "Home";
  const isHome = pathname === "/";
  const isCheckout = pathname === "/checkout";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm font-semibold md:hidden">Store Web</span>
        <IconChevronRight className="size-3 md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {isHome ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!isHome && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {!isCheckout && (
          <Link
            to="/checkout"
            aria-label="Go to checkout"
            className="relative ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
          >
            <ShoppingCart className="size-4" />
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] leading-none">
              0
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
