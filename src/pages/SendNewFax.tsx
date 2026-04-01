import { useState, useRef, useEffect, ChangeEvent } from "react"
import { ArrowLeft, Search, X, FileText, Scan, Eye, Save, Send, Plus, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export interface Contact {
  id: number
  name: string
  faxNumber: string
  address: string
}

export interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

export interface OutboxFaxFormData {
  id?: number
  status?: string
  sent?: string
  pages?: number
  recipient: string
  subject: string
  coverLetter: string
  attachments: Attachment[]
  resolution: string
  priority: string
}

interface SendNewFaxProps {
  onBack: () => void
  editingFax: OutboxFaxFormData | null
  onSave: (data: OutboxFaxFormData) => void
  onDelete: (id: number) => void
  contacts: Contact[]
  onAddContact: (prefillFax?: string) => void
  newContact: Contact | null
}

export interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

export interface OutboxFaxFormData {
  id?: number
  status?: string
  sent?: string
  pages?: number
  recipient: string
  subject: string
  coverLetter: string
  attachments: Attachment[]
  resolution: string
  priority: string
}

interface SendNewFaxProps {
  onBack: () => void
  editingFax: OutboxFaxFormData | null
  onSave: (data: OutboxFaxFormData) => void
  onDelete: (id: number) => void
}

export function SendNewFax({ onBack, editingFax, onSave, onDelete, contacts, onAddContact, newContact }: SendNewFaxProps) {
  const [recipientSearch, setRecipientSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [subject, setSubject] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scanInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (newContact) {
      setSelectedContact(newContact)
      setRecipientSearch(`${newContact.name} - ${newContact.faxNumber}`)
    }
  }, [newContact])

  useEffect(() => {
    if (editingFax) {
      setRecipientSearch(editingFax.recipient)
      setSubject(editingFax.subject)
      setCoverLetter(editingFax.coverLetter)
      setAttachments(editingFax.attachments)
      const matchedContact = contacts.find((c) => c.faxNumber === editingFax.recipient)
      if (matchedContact) {
        setSelectedContact(matchedContact)
        setRecipientSearch(`${matchedContact.name} - ${matchedContact.faxNumber}`)
      }
    } else {
      setRecipientSearch("")
      setSubject("")
      setCoverLetter("")
      setAttachments([])
      setSelectedContact(null)
    }
  }, [editingFax, contacts])

  const filteredContacts = recipientSearch.length > 0
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
          c.faxNumber.includes(recipientSearch) ||
          c.address.toLowerCase().includes(recipientSearch.toLowerCase())
      )
    : []

  function handleRecipientSelect(contact: Contact) {
    setSelectedContact(contact)
    setRecipientSearch(`${contact.name} - ${contact.faxNumber}`)
    setShowSuggestions(false)
  }

  function handleClearRecipient() {
    setSelectedContact(null)
    setRecipientSearch("")
    setShowSuggestions(false)
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newAttachment: Attachment = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
        }
        setAttachments((prev) => [...prev, newAttachment])
      })
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleScanDocument(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newAttachment: Attachment = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
        }
        setAttachments((prev) => [...prev, newAttachment])
      })
    }
    if (scanInputRef.current) {
      scanInputRef.current.value = ""
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  function handlePreview() {
    alert("Preview functionality - showing composed fax preview")
  }

  function handleSaveDraft() {
    alert("Fax saved as draft")
  }

  function handleSendFax() {
    if (!recipientSearch) {
      alert("Please select a recipient")
      return
    }
    if (attachments.length === 0) {
      alert("Please add at least one attachment")
      return
    }
    const recipientFax = selectedContact?.faxNumber || recipientSearch.split(" - ").pop() || recipientSearch
    onSave({
      id: editingFax?.id,
      recipient: recipientFax,
      subject,
      coverLetter,
      attachments,
      resolution: "standard",
      priority: "normal",
    })
  }

  function handleDelete() {
    if (editingFax?.id) {
      onDelete(editingFax.id)
    }
  }

  const isEditing = !!editingFax

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{isEditing ? "Edit Fax" : "Send New Fax"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          {isEditing && (
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button className="bg-black text-white hover:bg-black/90" onClick={handleSendFax}>
            <Send className="mr-2 h-4 w-4" />
            Send Fax
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recipient">Recipient</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const faxNumber = selectedContact?.faxNumber || recipientSearch.split(" - ").pop() || recipientSearch
                  onAddContact(faxNumber || undefined)
                }}
              >
                <UserPlus className="mr-1 h-3 w-3" />
                New Contact
              </Button>
            </div>
            <div className="relative">
              {selectedContact ? (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium">{selectedContact.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContact.faxNumber}</p>
                    <p className="text-xs text-muted-foreground">{selectedContact.address}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleClearRecipient}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="recipient"
                      placeholder="Search by name, fax number, or address"
                      className="pl-9"
                      value={recipientSearch}
                      onChange={(e) => {
                        setRecipientSearch(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200)
                      }}
                    />
                  </div>
                  {showSuggestions && filteredContacts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredContacts.map((contact) => (
                        <button
                          key={contact.id}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                          onMouseDown={() => handleRecipientSelect(contact)}
                        >
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.faxNumber}</p>
                          <p className="text-xs text-muted-foreground">{contact.address}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter fax subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Attachments</Label>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.tiff"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add File
              </Button>
              <input
                type="file"
                ref={scanInputRef}
                onChange={handleScanDocument}
                className="hidden"
                multiple
                accept="image/*,.pdf"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => scanInputRef.current?.click()}
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan Document
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 mt-3">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-md bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Type your cover letter message here..."
              className="min-h-[160px]"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
