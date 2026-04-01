import { ArrowLeft, Download, Scan } from "lucide-react"
import { invoke } from "@tauri-apps/api/core"
import { useState } from "react"
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
  const [pdfUrl, setPdfUrl] = useState(SAMPLE_PDF_URL)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  async function handleScan() {
    setScanning(true)
    setScanError(null)
    try {
      const scanner = localStorage.getItem("selected_scanner") || ""
      const ocr = localStorage.getItem("ocr_enabled") === "true"
      const tempDir = await invoke<string>("get_temp_dir")
      const outputPath = `${tempDir}/faxbox_scan_${Date.now()}.pdf`
      const result = await invoke<string>("scan_document", {
        scanner,
        outputPath,
        ocr,
      })
      setPdfUrl(result)
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Scan failed")
    } finally {
      setScanning(false)
    }
  }

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleScan}
            disabled={scanning}
          >
            <Scan className="mr-2 h-4 w-4" />
            {scanning ? "Scanning..." : "Scan"}
          </Button>
          <Button className="bg-black text-white hover:bg-black/90">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      {scanError && (
        <div className="px-6 py-2 bg-red-50 text-red-700 text-sm border-b">
          {scanError}
        </div>
      )}

      {/* Metadata Bar */}
      <FaxMetadata
        sender="Dr. Julian Vance"
        organization="Mercy General Hospital"
        faxNumber="+1 (555) 234-5678"
        faxDate="Oct 24, 2023"
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <PdfViewer pdfUrl={pdfUrl} />
      </div>
    </div>
  )
}
