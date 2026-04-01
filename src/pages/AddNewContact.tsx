import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export interface ContactFormData {
  id?: number
  fullName: string
  title: string
  specialty: string
  officeAddress: string
  phoneNumber: string
  faxNumber: string
  internalNotes: string
}

interface AddNewContactProps {
  onBack: () => void
  editingContact: ContactFormData | null
  onSave: (contact: ContactFormData) => void
  onDelete: (id: number) => void
  prefillFax?: string
}

export function AddNewContact({ onBack, editingContact, onSave, onDelete, prefillFax }: AddNewContactProps) {
  const [fullName, setFullName] = useState("")
  const [title, setTitle] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [officeAddress, setOfficeAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [faxNumber, setFaxNumber] = useState("")
  const [internalNotes, setInternalNotes] = useState("")

  useEffect(() => {
    if (editingContact) {
      setFullName(editingContact.fullName)
      setTitle(editingContact.title)
      setSpecialty(editingContact.specialty)
      setOfficeAddress(editingContact.officeAddress)
      setPhoneNumber(editingContact.phoneNumber)
      setFaxNumber(editingContact.faxNumber)
      setInternalNotes(editingContact.internalNotes)
    } else if (prefillFax) {
      setFaxNumber(prefillFax)
    } else {
      setFullName("")
      setTitle("")
      setSpecialty("")
      setOfficeAddress("")
      setPhoneNumber("")
      setFaxNumber("")
      setInternalNotes("")
    }
  }, [editingContact, prefillFax])

  function handleSave() {
    if (!fullName) {
      alert("Please enter a full name")
      return
    }
    onSave({
      id: editingContact?.id,
      fullName,
      title,
      specialty,
      officeAddress,
      phoneNumber,
      faxNumber,
      internalNotes,
    })
  }

  function handleDelete() {
    if (editingContact?.id) {
      onDelete(editingContact.id)
    }
  }

  const isEditing = !!editingContact

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{isEditing ? "Edit Contact" : "Add New Contact"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          {isEditing && (
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button className="bg-black text-white hover:bg-black/90" onClick={handleSave}>
            {isEditing ? "Save Contact" : "Save Contact"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              placeholder="Enter specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeAddress">Office Address</Label>
            <Input
              id="officeAddress"
              placeholder="Enter office address"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faxNumber">Fax Number</Label>
            <Input
              id="faxNumber"
              placeholder="Enter fax number"
              value={faxNumber}
              onChange={(e) => setFaxNumber(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Notes (Optional)</Label>
            <Textarea
              id="internalNotes"
              placeholder="Add any internal notes here..."
              className="min-h-[120px]"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
