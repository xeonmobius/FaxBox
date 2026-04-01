import { useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Printer, AlignJustify } from "lucide-react"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfToolbarProps {
  numPages: number | null
  pageNumber: number
  scale: number
  pdfUrl: string
  onSetPage: (page: number) => void
  onSetScale: (scale: number) => void
  onPrint: () => void
}

export function PdfToolbar({ numPages, pageNumber, scale, pdfUrl, onSetPage, onSetScale, onPrint }: PdfToolbarProps) {
  const [printing, setPrinting] = useState(false)
  const [printError, setPrintError] = useState<string | null>(null)

  async function handleNativePrint() {
    setPrinting(true)
    setPrintError(null)
    try {
      const printer = localStorage.getItem("selected_printer") || ""
      if (!printer) {
        setPrintError("No printer selected. Configure a printer in Settings.")
        return
      }
      await invoke("print_pdf", { filePath: pdfUrl, printerName: printer })
      onPrint()
    } catch (err) {
      setPrintError(err instanceof Error ? err.message : "Print failed")
    } finally {
      setPrinting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => onSetPage(pageNumber - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => onSetPage(pageNumber + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={scale <= 0.5}
            onClick={() => onSetScale(scale - 0.25)}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={scale >= 2}
            onClick={() => onSetScale(scale + 0.25)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNativePrint}
            disabled={printing}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {printError && (
        <div className="px-4 py-1 bg-red-50 text-red-700 text-xs border-b">
          {printError}
        </div>
      )}
    </div>
  )
}

interface PdfViewerProps {
  pdfUrl: string
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(_err: Error) {
    setError("Failed to load PDF document")
    setLoading(false)
  }

  function handlePrint() {}

  return (
    <div className="flex flex-col h-full">
      <PdfToolbar
        numPages={numPages}
        pageNumber={pageNumber}
        scale={scale}
        pdfUrl={pdfUrl}
        onSetPage={setPageNumber}
        onSetScale={setScale}
        onPrint={handlePrint}
      />

      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<p className="text-muted-foreground">Loading document...</p>}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}
