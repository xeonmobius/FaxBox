import { Users, Send, Inbox, FileText, Plus, Settings } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Inbox", icon: Inbox, view: "inbox" },
  { title: "Outbox", icon: Send, view: "outbox" },
  { title: "Drafts", icon: FileText, view: "drafts" },
  { title: "Contacts", icon: Users, view: "contacts" },
  { title: "Settings", icon: Settings, view: "settings" },
]

interface AppSidebarProps {
  onNavigate: (view: string) => void
  activeView?: string
  inboxCount?: number
}

export function AppSidebar({ onNavigate, activeView, inboxCount = 0 }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-teal-700" />
              FaxBox
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onNavigate("newfax")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Send New Fax
              </Button>
            </div>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activeView === item.view
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => onNavigate(item.view)} className="relative">
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-md bg-accent"
                          transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.view === "inbox" && inboxCount > 0 && (
                          <span className="ml-auto rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {inboxCount}
                          </span>
                        )}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
