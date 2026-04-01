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
import { SendNewFax, type OutboxFaxFormData } from "@/pages/SendNewFax"
import { Contacts, type Contact } from "@/pages/Contacts"
import { AddNewContact, type ContactFormData } from "@/pages/AddNewContact"

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

const initialOutboxFaxes: OutboxFaxFormData[] = [
  { id: 1, status: "Sent", recipient: "+1 (555) 111-2222", sent: "2024-01-15 09:30 AM", pages: 3, subject: "Patient Records", coverLetter: "Please find the attached patient records for your review.", attachments: [{ id: "1", name: "patient_records.pdf", size: "2.3 MB", type: "application/pdf" }], resolution: "standard", priority: "normal" },
  { id: 2, status: "Failed", recipient: "+1 (555) 333-4444", sent: "2024-01-15 10:15 AM", pages: 1, subject: "Invoice #1234", coverLetter: "Attached is the invoice for services rendered.", attachments: [{ id: "2", name: "invoice_1234.pdf", size: "450 KB", type: "application/pdf" }], resolution: "fine", priority: "high" },
  { id: 3, status: "Sending", recipient: "+1 (555) 555-6666", sent: "2024-01-14 02:45 PM", pages: 5, subject: "Lab Results", coverLetter: "Lab results for patient John Doe.", attachments: [{ id: "3", name: "lab_results.pdf", size: "1.8 MB", type: "application/pdf" }], resolution: "super-fine", priority: "normal" },
  { id: 4, status: "Sent", recipient: "+1 (555) 777-8888", sent: "2024-01-14 04:00 PM", pages: 2, subject: "Prescription Refill", coverLetter: "Prescription refill request for patient Jane Smith.", attachments: [{ id: "4", name: "prescription.pdf", size: "320 KB", type: "application/pdf" }], resolution: "standard", priority: "normal" },
  { id: 5, status: "Sent", recipient: "+1 (555) 999-0000", sent: "2024-01-13 11:20 AM", pages: 4, subject: "Insurance Claim", coverLetter: "Insurance claim documentation for processing.", attachments: [{ id: "5", name: "claim_docs.pdf", size: "3.1 MB", type: "application/pdf" }], resolution: "fine", priority: "normal" },
  { id: 6, status: "Failed", recipient: "+1 (555) 222-3333", sent: "2024-01-13 08:00 AM", pages: 2, subject: "Referral Letter", coverLetter: "Patient referral to specialist.", attachments: [{ id: "6", name: "referral.pdf", size: "560 KB", type: "application/pdf" }], resolution: "standard", priority: "high" },
  { id: 7, status: "Sent", recipient: "+1 (555) 444-5555", sent: "2024-01-12 03:30 PM", pages: 6, subject: "Medical Report", coverLetter: "Comprehensive medical report for review.", attachments: [{ id: "7", name: "medical_report.pdf", size: "4.2 MB", type: "application/pdf" }], resolution: "super-fine", priority: "normal" },
  { id: 8, status: "Sending", recipient: "+1 (555) 666-7777", sent: "2024-01-12 01:15 PM", pages: 1, subject: "Appointment Confirmation", coverLetter: "Appointment confirmation details.", attachments: [{ id: "8", name: "appointment.pdf", size: "180 KB", type: "application/pdf" }], resolution: "standard", priority: "low" },
  { id: 9, status: "Sent", recipient: "+1 (555) 888-9999", sent: "2024-01-11 10:45 AM", pages: 3, subject: "Test Results", coverLetter: "Test results for patient review.", attachments: [{ id: "9", name: "test_results.pdf", size: "1.5 MB", type: "application/pdf" }], resolution: "fine", priority: "normal" },
  { id: 10, status: "Sent", recipient: "+1 (555) 123-4567", sent: "2024-01-11 09:00 AM", pages: 7, subject: "Discharge Summary", coverLetter: "Patient discharge summary and follow-up instructions.", attachments: [{ id: "10", name: "discharge.pdf", size: "2.8 MB", type: "application/pdf" }], resolution: "standard", priority: "normal" },
  { id: 11, status: "Failed", recipient: "+1 (555) 234-5678", sent: "2024-01-10 04:20 PM", pages: 2, subject: "Billing Statement", coverLetter: "Monthly billing statement.", attachments: [{ id: "11", name: "billing.pdf", size: "890 KB", type: "application/pdf" }], resolution: "standard", priority: "normal" },
  { id: 12, status: "Sent", recipient: "+1 (555) 345-6789", sent: "2024-01-10 11:30 AM", pages: 4, subject: "Treatment Plan", coverLetter: "Proposed treatment plan for review.", attachments: [{ id: "12", name: "treatment_plan.pdf", size: "1.9 MB", type: "application/pdf" }], resolution: "fine", priority: "normal" },
]

const initialContacts: Contact[] = [
  { id: 1, fullName: "Dr. Sarah Chen", title: "MD", specialty: "Cardiology", officeAddress: "123 Medical Center Dr, Suite 400", phoneNumber: "+1 (555) 234-5678", faxNumber: "+1 (555) 234-5679", internalNotes: "" },
  { id: 2, fullName: "John Smith", title: "Esq.", specialty: "Legal", officeAddress: "456 Justice Ave, Floor 2", phoneNumber: "+1 (555) 345-6789", faxNumber: "+1 (555) 345-6780", internalNotes: "" },
  { id: 3, fullName: "Metro Hospital", title: "", specialty: "General Medicine", officeAddress: "789 Health Blvd", phoneNumber: "+1 (555) 456-7890", faxNumber: "+1 (555) 456-7891", internalNotes: "" },
  { id: 4, fullName: "ABC Corporation", title: "", specialty: "Business Services", officeAddress: "321 Business Park, Unit 5", phoneNumber: "+1 (555) 567-8901", faxNumber: "+1 (555) 567-8902", internalNotes: "" },
  { id: 5, fullName: "City Clinic", title: "", specialty: "Primary Care", officeAddress: "654 Wellness St", phoneNumber: "+1 (555) 678-9012", faxNumber: "+1 (555) 678-9013", internalNotes: "" },
  { id: 6, fullName: "Dr. Emily Rodriguez", title: "MD", specialty: "Neurology", officeAddress: "987 Brain Research Way", phoneNumber: "+1 (555) 789-0123", faxNumber: "+1 (555) 789-0124", internalNotes: "" },
  { id: 7, fullName: "Green Valley Pharmacy", title: "", specialty: "Pharmacy", officeAddress: "147 Oak Lane", phoneNumber: "+1 (555) 890-1234", faxNumber: "+1 (555) 890-1235", internalNotes: "" },
  { id: 8, fullName: "Dr. Michael Park", title: "MD", specialty: "Orthopedics", officeAddress: "258 Bone Health Dr", phoneNumber: "+1 (555) 901-2345", faxNumber: "+1 (555) 901-2346", internalNotes: "" },
  { id: 9, fullName: "Riverside Imaging Center", title: "", specialty: "Radiology", officeAddress: "369 Scan Blvd, Suite 100", phoneNumber: "+1 (555) 012-3456", faxNumber: "+1 (555) 012-3457", internalNotes: "" },
  { id: 10, fullName: "Dr. Lisa Thompson", title: "MD", specialty: "Pediatrics", officeAddress: "741 Children's Way", phoneNumber: "+1 (555) 123-4567", faxNumber: "+1 (555) 123-4568", internalNotes: "" },
  { id: 11, fullName: "Summit Dental Group", title: "", specialty: "Dentistry", officeAddress: "852 Smile Ave", phoneNumber: "+1 (555) 234-5670", faxNumber: "+1 (555) 234-5671", internalNotes: "" },
  { id: 12, fullName: "Dr. Robert Kim", title: "MD", specialty: "Dermatology", officeAddress: "963 Skin Care Ln", phoneNumber: "+1 (555) 345-6780", faxNumber: "+1 (555) 345-6781", internalNotes: "" },
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
  const [activeView, setActiveView] = useState<"inbox" | "outbox" | "newfax" | "contacts" | "addContact">("inbox")
  const [currentPage, setCurrentPage] = useState(1)
  const [outboxPage, setOutboxPage] = useState(1)
  const [previewFax, setPreviewFax] = useState<FaxItem | null>(null)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [outboxFaxes, setOutboxFaxes] = useState<OutboxFaxFormData[]>(initialOutboxFaxes)
  const [editingOutboxFax, setEditingOutboxFax] = useState<OutboxFaxFormData | null>(null)
  const faxCount = faxes.filter((f) => f.status === "New").length

  const inboxTotalPages = Math.ceil(faxes.length / ITEMS_PER_PAGE)
  const inboxStartIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFaxes = faxes.slice(inboxStartIndex, inboxStartIndex + ITEMS_PER_PAGE)

  const outboxTotalPages = Math.ceil(outboxFaxes.length / ITEMS_PER_PAGE)
  const outboxStartIndex = (outboxPage - 1) * ITEMS_PER_PAGE
  const paginatedOutboxFaxes = outboxFaxes.slice(outboxStartIndex, outboxStartIndex + ITEMS_PER_PAGE)

  const failedCount = outboxFaxes.filter((f) => f.status === "Failed").length
  const sentCount = outboxFaxes.filter((f) => f.status === "Sent").length

  function handleAddContact() {
    setEditingContact(null)
    setActiveView("addContact")
  }

  function handleEditContact(contact: Contact) {
    setEditingContact(contact)
    setActiveView("addContact")
  }

  function handleSaveContact(data: ContactFormData) {
    if (data.id) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === data.id
            ? { ...c, fullName: data.fullName, title: data.title, specialty: data.specialty, officeAddress: data.officeAddress, phoneNumber: data.phoneNumber, faxNumber: data.faxNumber, internalNotes: data.internalNotes }
            : c
        )
      )
    } else {
      const newId = Math.max(...contacts.map((c) => c.id), 0) + 1
      setContacts((prev) => [
        ...prev,
        {
          id: newId,
          fullName: data.fullName,
          title: data.title,
          specialty: data.specialty,
          officeAddress: data.officeAddress,
          phoneNumber: data.phoneNumber,
          faxNumber: data.faxNumber,
          internalNotes: data.internalNotes,
        },
      ])
    }
    setActiveView("contacts")
  }

  function handleDeleteContact(id: number) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    setActiveView("contacts")
  }

  function handleEditOutboxFax(fax: OutboxFaxFormData) {
    setEditingOutboxFax(fax)
    setActiveView("newfax")
  }

  function handleSaveOutboxFax(data: OutboxFaxFormData) {
    if (data.id) {
      setOutboxFaxes((prev) =>
        prev.map((f) =>
          f.id === data.id
            ? { ...f, recipient: data.recipient, subject: data.subject, coverLetter: data.coverLetter, attachments: data.attachments }
            : f
        )
      )
    } else {
      const newId = Math.max(...outboxFaxes.map((f) => f.id || 0), 0) + 1
      setOutboxFaxes((prev) => [
        ...prev,
        {
          id: newId,
          status: "Sent",
          sent: new Date().toLocaleString(),
          pages: data.attachments.length,
          recipient: data.recipient,
          subject: data.subject,
          coverLetter: data.coverLetter,
          attachments: data.attachments,
          resolution: data.resolution,
          priority: data.priority,
        },
      ])
    }
    setActiveView("outbox")
  }

  function handleDeleteOutboxFax(id: number) {
    setOutboxFaxes((prev) => prev.filter((f) => f.id !== id))
    setActiveView("outbox")
  }

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
          } else if (view === "newfax") {
            setPreviewFax(null)
            setEditingOutboxFax(null)
            setActiveView("newfax")
          } else if (view === "contacts") {
            setPreviewFax(null)
            setActiveView("contacts")
          }
        }} />
        <main className="flex-1 p-6">
          {activeView === "newfax" ? (
            <SendNewFax
              onBack={() => {
                setEditingOutboxFax(null)
                setActiveView("outbox")
              }}
              editingFax={editingOutboxFax}
              onSave={handleSaveOutboxFax}
              onDelete={handleDeleteOutboxFax}
            />
          ) : activeView === "addContact" ? (
            <AddNewContact
              onBack={() => setActiveView("contacts")}
              editingContact={editingContact}
              onSave={handleSaveContact}
              onDelete={handleDeleteContact}
            />
          ) : activeView === "contacts" ? (
            <Contacts
              contacts={contacts}
              onAddContact={handleAddContact}
              onEditContact={handleEditContact}
            />
          ) : (
            <>
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
                <div className="flex gap-6">
                  <Card className="w-fit">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">{sentCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total Sent
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="w-fit">
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">{failedCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Failed
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
                                onClick={() => setPreviewFax({ id: fax.id || 0, status: fax.status || "", recipient: fax.recipient, sent: fax.sent, pages: fax.pages || 0 })}
                              >
                                Preview
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOutboxFax(fax)}
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
            </>
          )}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
