import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const faxes = [
  { id: 1, status: "New", sender: "+1 (555) 123-4567", received: "2024-01-15 09:30 AM", pages: 3 },
  { id: 2, status: "New", sender: "+1 (555) 987-6543", received: "2024-01-15 10:15 AM", pages: 1 },
  { id: 3, status: "Viewed", sender: "+1 (555) 456-7890", received: "2024-01-14 02:45 PM", pages: 5 },
  { id: 4, status: "New", sender: "+1 (555) 321-0987", received: "2024-01-14 04:00 PM", pages: 2 },
  { id: 5, status: "Viewed", sender: "+1 (555) 654-3210", received: "2024-01-13 11:20 AM", pages: 4 },
]

export default function App() {
  const [activeView, _setActiveView] = useState<"inbox" | "outbox">("inbox")
  const faxCount = faxes.filter((f) => f.status === "New").length

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold mt-4">
            {activeView === "inbox" ? "Inbox" : "Outbox"}
          </h1>
          <div className="mt-4 space-y-6">
            {activeView === "inbox" ? (
              <>
                <Card className="w-fit">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold">{faxCount}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      unprocessed faxes today
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faxes.map((fax) => (
                          <TableRow key={fax.id}>
                            <TableCell>{fax.status}</TableCell>
                            <TableCell>{fax.sender}</TableCell>
                            <TableCell>{fax.received}</TableCell>
                            <TableCell>{fax.pages}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">Preview</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-muted-foreground">No faxes sent yet.</p>
            )}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
