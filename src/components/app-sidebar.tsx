import { Users, Send, Inbox, FileText, Plus } from "lucide-react"
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
  { title: "Outbox", icon: Send },
  { title: "Inbox", icon: Inbox },
  { title: "Drafts", icon: FileText },
  { title: "Contacts", icon: Users },
]

interface AppSidebarProps {
  onNavigate: (view: string) => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>FaxBox</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <Button className="w-full bg-black text-white hover:bg-black/90">
                <Plus className="mr-2 h-4 w-4" />
                Send New Fax
              </Button>
            </div>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => onNavigate(item.title.toLowerCase())}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
