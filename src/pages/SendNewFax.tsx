import { ArrowLeft, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function SendNewFax() {
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
        <Button className="bg-black text-white hover:bg-black/90">Send Fax</Button>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6 max-w-3xl">
        <div className="space-y-6">
          {/* To field */}
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input id="to" placeholder="Enter fax number or contact name" />
          </div>

          {/* Subject field */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter fax subject" />
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-[160px]"
            />
          </div>

          {/* Attachments field */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Add File
              </Button>
            </div>
          </div>

          <Separator />

          {/* Fax Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Fax Options</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Resolution */}
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="fine">Fine</SelectItem>
                    <SelectItem value="super-fine">Super Fine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
