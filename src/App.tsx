import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"

export default function App() {
  const [activeView, _setActiveView] = useState<"inbox" | "outbox">("inbox")

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold mt-4">
            {activeView === "inbox" ? "Inbox" : "Outbox"}
          </h1>
          <div className="mt-4 space-y-2">
            {activeView === "inbox" ? (
              <p className="text-muted-foreground">No faxes received yet.</p>
            ) : (
              <p className="text-muted-foreground">No faxes sent yet.</p>
            )}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
