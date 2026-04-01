import { useState, useRef, ChangeEvent } from "react"
import { ArrowLeft, Search, X, FileText, Scan, Eye, Save, Send, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface Contact {
  id: number
  name: string
  faxNumber: string
  address: string
}

interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

const mockContacts: Contact[] = [
  { id: 1, name: "Dr. Sarah Chen", faxNumber: "+1 (555) 234-5678", address: "123 Medical Center Dr" },
  { id: 2, name: "John Smith Law Office", faxNumber: "+1 (555) 345-6789", address: "456 Justice Ave" },
  { id: 3, name: "Metro Hospital", faxNumber: "+1 (555) 456-7890", address: "789 Health Blvd" },
  { id: 4, name: "ABC Corporation", faxNumber: "+1 (555) 567-8901", address: "321 Business Park" },
  { id: 5, name: "City Clinic", faxNumber: "+1 (555) 678-9012", address: "654 Wellness St" },
]

export function SendNewFax() {
  const [recipientSearch, setRecipientSearch] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scanInputRef = useRef<HTMLInputElement>(null)

  const filteredContacts = recipientSearch.length > 0
    ? mockContacts.filter(
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
    if (!selectedContact && !recipientSearch) {
      alert("Please select a recipient")
      return
    }
    if (attachments.length === 0) {
      alert("Please add at least one attachment")
      return
    }
    alert("Sending fax...")
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Send New Fax</h1>
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
          <Button className="bg-black text-white hover:bg-black/90" onClick={handleSendFax}>
            <Send className="mr-2 h-4 w-4" />
            Send Fax
          </Button>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Recipient Search */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
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

          <Separator />

          {/* Attachments */}
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

          {/* Cover Letter */}
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
