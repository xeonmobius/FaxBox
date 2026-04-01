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

const outboxFaxes = [
  { id: 1, status: "Sent", recipient: "+1 (555) 111-2222", sent: "2024-01-15 09:30 AM", pages: 3 },
  { id: 2, status: "Failed", recipient: "+1 (555) 333-4444", sent: "2024-01-15 10:15 AM", pages: 1 },
  { id: 3, status: "Sending", recipient: "+1 (555) 555-6666", sent: "2024-01-14 02:45 PM", pages: 5 },
  { id: 4, status: "Sent", recipient: "+1 (555) 777-8888", sent: "2024-01-14 04:00 PM", pages: 2 },
  { id: 5, status: "Sent", recipient: "+1 (555) 999-0000", sent: "2024-01-13 11:20 AM", pages: 4 },
  { id: 6, status: "Failed", recipient: "+1 (555) 222-3333", sent: "2024-01-13 08:00 AM", pages: 2 },
  { id: 7, status: "Sent", recipient: "+1 (555) 444-5555", sent: "2024-01-12 03:30 PM", pages: 6 },
  { id: 8, status: "Sending", recipient: "+1 (555) 666-7777", sent: "2024-01-12 01:15 PM", pages: 1 },
  { id: 9, status: "Sent", recipient: "+1 (555) 888-9999", sent: "2024-01-11 10:45 AM", pages: 3 },
  { id: 10, status: "Sent", recipient: "+1 (555) 123-4567", sent: "2024-01-11 09:00 AM", pages: 7 },
  { id: 11, status: "Failed", recipient: "+1 (555) 234-5678", sent: "2024-01-10 04:20 PM", pages: 2 },
  { id: 12, status: "Sent", recipient: "+1 (555) 345-6789", sent: "2024-01-10 11:30 AM", pages: 4 },
]

const ITEMS_PER_PAGE = 10

type FaxItem = {
  id: number
  status: string
  sender?: string
  recipient?: string
  received?: string
  sent?: string
  pages: number
}

export default function App() {
  const [activeView, setActiveView] = useState<"inbox" | "outbox">("inbox")
  const [currentPage, setCurrentPage] = useState(1)
  const [outboxPage, setOutboxPage] = useState(1)
  const [previewFax, setPreviewFax] = useState<FaxItem | null>(null)
  const faxCount = faxes.filter((f) => f.status === "New").length

  const inboxTotalPages = Math.ceil(faxes.length / ITEMS_PER_PAGE)
  const inboxStartIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFaxes = faxes.slice(inboxStartIndex, inboxStartIndex + ITEMS_PER_PAGE)

  const outboxTotalPages = Math.ceil(outboxFaxes.length / ITEMS_PER_PAGE)
  const outboxStartIndex = (outboxPage - 1) * ITEMS_PER_PAGE
  const paginatedOutboxFaxes = outboxFaxes.slice(outboxStartIndex, outboxStartIndex + ITEMS_PER_PAGE)

  const failedCount = outboxFaxes.filter((f) => f.status === "Failed").length
  const sentCount = outboxFaxes.filter((f) => f.status === "Sent").length

  if (previewFax) {
    return (
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar onNavigate={() => setPreviewFax(null)} />
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
        <AppSidebar onNavigate={(view) => {
          if (view === "inbox") {
            setPreviewFax(null)
            setActiveView("inbox")
          } else if (view === "outbox") {
            setPreviewFax(null)
            setActiveView("outbox")
          }
        }} />
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
                      {Array.from({ length: inboxTotalPages }, (_, i) => i + 1).map((page) => (
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
                            if (currentPage < inboxTotalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === inboxTotalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <Card className="w-fit">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">{sentCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        total sent
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="w-fit">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">{failedCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        failed
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Sent</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOutboxFaxes.map((fax) => (
                          <TableRow key={fax.id}>
                            <TableCell>{fax.status}</TableCell>
                            <TableCell>{fax.recipient}</TableCell>
                            <TableCell>{fax.sent}</TableCell>
                            <TableCell>{fax.pages}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewFax(fax)}
                              >
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => alert("Edit functionality coming soon")}
                              >
                                Edit
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
                            if (outboxPage > 1) setOutboxPage(outboxPage - 1)
                          }}
                          className={outboxPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: outboxTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === outboxPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setOutboxPage(page)
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
                            if (outboxPage < outboxTotalPages) setOutboxPage(outboxPage + 1)
                          }}
                          className={outboxPage === outboxTotalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
