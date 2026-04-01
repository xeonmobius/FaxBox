import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent } from "@/components/ui/card"

export default function App() {
  const [activeView, _setActiveView] = useState<"inbox" | "outbox">("inbox")
  const faxCount = 5

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold mt-4">
            {activeView === "inbox" ? "Inbox" : "Outbox"}
          </h1>
          <div className="mt-4">
            {activeView === "inbox" ? (
              <Card className="w-fit">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold">{faxCount}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    unprocessed faxes today
                  </p>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">No faxes sent yet.</p>
            )}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
