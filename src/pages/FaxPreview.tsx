import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PdfViewer } from "@/components/PdfViewer"
import { FaxMetadata } from "@/components/FaxMetadata"

interface FaxPreviewProps {
  fax: {
    id: number
    status: string
    pages: number
    sender?: string
    recipient?: string
    received?: string
    sent?: string
  }
  onBack: () => void
}

const SAMPLE_PDF_URL = "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"

export function FaxPreview({ fax: _fax, onBack }: FaxPreviewProps) {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Fax Preview</h1>
        </div>
        <Button className="bg-black text-white hover:bg-black/90">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer */}
        <div className="flex-1">
          <PdfViewer pdfUrl={SAMPLE_PDF_URL} />
        </div>

        {/* Metadata Panel */}
        <FaxMetadata
          sender="Dr. Julian Vance"
          organization="Mercy General Hospital"
          address="123 Medical Center Dr, Suite 400"
          faxNumber="+1 (555) 234-5678"
          faxDate="Oct 24, 2023"
        />
      </div>
    </div>
  )
}
