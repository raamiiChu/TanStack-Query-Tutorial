import Link from "next/link";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { ExternalLink } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import NetworkControls from "@/components/network-controls";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sideBarGroups } from "@/constants";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <nav className="flex items-center justify-between">
            <ModeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/raamiiChu/TanStack-Query-Tutorial"
                target="_blank"
              >
                <SiGithub className="size-[1.2rem]" />
              </Link>
            </Button>
          </nav>
          {sideBarGroups.map(({ groupLabel, menuItems }) => (
            <div key={groupLabel}>
              <SidebarGroupLabel className="flex items-center justify-between py-6">
                <p>{groupLabel}</p>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(({ title, url, Icon, isBlank }) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton asChild url={url}>
                        <Link href={url} target={isBlank ? "_blank" : "_self"}>
                          <Icon />
                          <span>{title}</span>
                          <span>{isBlank && <ExternalLink size={14} />}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NetworkControls />
      </SidebarFooter>
    </Sidebar>
  );
}
