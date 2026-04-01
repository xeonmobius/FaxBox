import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

interface Contact {
  id: number
  provider: string
  specialty: string
  address: string
  phone: string
  fax: string
}

const contacts: Contact[] = [
  { id: 1, provider: "Dr. Sarah Chen", specialty: "Cardiology", address: "123 Medical Center Dr, Suite 400", phone: "+1 (555) 234-5678", fax: "+1 (555) 234-5679" },
  { id: 2, provider: "John Smith Law Office", specialty: "Legal", address: "456 Justice Ave, Floor 2", phone: "+1 (555) 345-6789", fax: "+1 (555) 345-6780" },
  { id: 3, provider: "Metro Hospital", specialty: "General Medicine", address: "789 Health Blvd", phone: "+1 (555) 456-7890", fax: "+1 (555) 456-7891" },
  { id: 4, provider: "ABC Corporation", specialty: "Business Services", address: "321 Business Park, Unit 5", phone: "+1 (555) 567-8901", fax: "+1 (555) 567-8902" },
  { id: 5, provider: "City Clinic", specialty: "Primary Care", address: "654 Wellness St", phone: "+1 (555) 678-9012", fax: "+1 (555) 678-9013" },
  { id: 6, provider: "Dr. Emily Rodriguez", specialty: "Neurology", address: "987 Brain Research Way", phone: "+1 (555) 789-0123", fax: "+1 (555) 789-0124" },
  { id: 7, provider: "Green Valley Pharmacy", specialty: "Pharmacy", address: "147 Oak Lane", phone: "+1 (555) 890-1234", fax: "+1 (555) 890-1235" },
  { id: 8, provider: "Dr. Michael Park", specialty: "Orthopedics", address: "258 Bone Health Dr", phone: "+1 (555) 901-2345", fax: "+1 (555) 901-2346" },
  { id: 9, provider: "Riverside Imaging Center", specialty: "Radiology", address: "369 Scan Blvd, Suite 100", phone: "+1 (555) 012-3456", fax: "+1 (555) 012-3457" },
  { id: 10, provider: "Dr. Lisa Thompson", specialty: "Pediatrics", address: "741 Children's Way", phone: "+1 (555) 123-4567", fax: "+1 (555) 123-4568" },
  { id: 11, provider: "Summit Dental Group", specialty: "Dentistry", address: "852 Smile Ave", phone: "+1 (555) 234-5670", fax: "+1 (555) 234-5671" },
  { id: 12, provider: "Dr. Robert Kim", specialty: "Dermatology", address: "963 Skin Care Ln", phone: "+1 (555) 345-6780", fax: "+1 (555) 345-6781" },
]

const ITEMS_PER_PAGE = 10

interface ContactsProps {
  onAddContact: () => void
}

export function Contacts({ onAddContact }: ContactsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedContacts = contacts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mt-4">Contacts</h1>
        <Button className="bg-black text-white hover:bg-black/90" onClick={onAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider / Facility</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Fax Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.provider}</TableCell>
                  <TableCell>{contact.specialty}</TableCell>
                  <TableCell>{contact.address}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.fax}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => alert("Edit contact")}>
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
    </div>
  )
}
