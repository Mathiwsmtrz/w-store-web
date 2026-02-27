import {
  IconDashboard,
  IconShoppingBag,
  IconShoppingCart,
  IconHistoryToggle,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { to: "/", label: "Home", icon: IconDashboard },
  { to: "/checkout", label: "Checkout", icon: IconShoppingCart },
  { to: "/tracking", label: "Tracking", icon: IconHistoryToggle },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader className="p-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="mb-2 bg-emerald-50">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="text-emerald-800">
                <div className="bg-emerald-300 rounded-sm p-0.5">
                  <IconShoppingBag className="!size-5" />
                </div>
                <span className="text-base font-semibold font-sans">Store Web</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <link.icon />
                      <span className={isActive ? "font-semibold" : undefined}>
                        {link.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
