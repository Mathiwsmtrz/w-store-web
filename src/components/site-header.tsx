import { useState } from "react";
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
import { CartSheet } from "@/components/cart-sheet";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getBreadcrumbLabel } from "@/lib/page-meta";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalItems } from "@/store/slices/cart.slice";

export function SiteHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { pathname } = useLocation();
  const totalItems = useAppSelector(selectCartTotalItems);
  const currentLabel = getBreadcrumbLabel(pathname);
  const isHome = pathname === "/";
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
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
        <button
          type="button"
          aria-label="Open cart"
          onClick={handleOpenCart}
          className="relative ml-auto inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border hover:bg-accent"
        >
          <ShoppingCart className="size-4" />
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] leading-none">
            {totalItems}
          </span>
        </button>
      </div>
      </header>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
