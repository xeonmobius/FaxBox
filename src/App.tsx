import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { FaxPreview } from "@/pages/FaxPreview"

const faxes = [
  { id: 1, status: "New", sender: "+1 (555) 123-4567", received: "2024-01-15 09:30 AM", pages: 3 },
  { id: 2, status: "New", sender: "+1 (555) 987-6543", received: "2024-01-15 10:15 AM", pages: 1 },
  { id: 3, status: "Viewed", sender: "+1 (555) 456-7890", received: "2024-01-14 02:45 PM", pages: 5 },
  { id: 4, status: "New", sender: "+1 (555) 321-0987", received: "2024-01-14 04:00 PM", pages: 2 },
  { id: 5, status: "Viewed", sender: "+1 (555) 654-3210", received: "2024-01-13 11:20 AM", pages: 4 },
  { id: 6, status: "New", sender: "+1 (555) 111-2222", received: "2024-01-13 08:00 AM", pages: 2 },
  { id: 7, status: "Viewed", sender: "+1 (555) 333-4444", received: "2024-01-12 03:30 PM", pages: 6 },
  { id: 8, status: "New", sender: "+1 (555) 555-6666", received: "2024-01-12 01:15 PM", pages: 1 },
  { id: 9, status: "Viewed", sender: "+1 (555) 777-8888", received: "2024-01-11 10:45 AM", pages: 3 },
  { id: 10, status: "New", sender: "+1 (555) 999-0000", received: "2024-01-11 09:00 AM", pages: 7 },
  { id: 11, status: "Viewed", sender: "+1 (555) 222-3333", received: "2024-01-10 04:20 PM", pages: 2 },
  { id: 12, status: "New", sender: "+1 (555) 444-5555", received: "2024-01-10 11:30 AM", pages: 4 },
]

const ITEMS_PER_PAGE = 10

export default function App() {
  const [activeView, _setActiveView] = useState<"inbox" | "outbox">("inbox")
  const [currentPage, setCurrentPage] = useState(1)
  const [previewFax, setPreviewFax] = useState<typeof faxes[0] | null>(null)
  const faxCount = faxes.filter((f) => f.status === "New").length

  const totalPages = Math.ceil(faxes.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFaxes = faxes.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (previewFax) {
    return (
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <FaxPreview
            fax={previewFax}
            onBack={() => setPreviewFax(null)}
          />
        </SidebarProvider>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6">
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
                        {paginatedFaxes.map((fax) => (
                          <TableRow key={fax.id}>
                            <TableCell>{fax.status}</TableCell>
                            <TableCell>{fax.sender}</TableCell>
                            <TableCell>{fax.received}</TableCell>
                            <TableCell>{fax.pages}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewFax(fax)}
                              >
                                Preview
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
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
