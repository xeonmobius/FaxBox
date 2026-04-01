import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DeviceInfo {
  name: string
  is_default: boolean
}

export function Settings() {
  const isWindows = /Windows/.test(navigator.userAgent)
  const [scanners, setScanners] = useState<DeviceInfo[]>([])
  const [printers, setPrinters] = useState<DeviceInfo[]>([])
  const [selectedScanner, setSelectedScanner] = useState<string>("")
  const [selectedPrinter, setSelectedPrinter] = useState<string>("")
  const [ocrEnabled, setOcrEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const [scannersList, printersList] = await Promise.all([
        invoke<DeviceInfo[]>("list_scanners"),
        invoke<DeviceInfo[]>("list_printers"),
      ])
      setScanners(scannersList)
      setPrinters(printersList)

      const savedScanner = localStorage.getItem("selected_scanner")
      const savedPrinter = localStorage.getItem("selected_printer")
      const savedOcr = localStorage.getItem("ocr_enabled")

      if (savedScanner && scannersList.some((s) => s.name === savedScanner)) {
        setSelectedScanner(savedScanner)
      } else if (scannersList.length > 0) {
        setSelectedScanner(scannersList[0].name)
      }

      if (savedPrinter && printersList.some((p) => p.name === savedPrinter)) {
        setSelectedPrinter(savedPrinter)
      } else {
        const defaultPrinter = printersList.find((p) => p.is_default)
        setSelectedPrinter(defaultPrinter?.name || (printersList.length > 0 ? printersList[0].name : ""))
      }

      setOcrEnabled(savedOcr === "true")
    } catch (err) {
      console.error("Failed to load devices:", err)
      if (!isWindows) {
        setMessage("Scanning is only available on Windows. Printer detection still works.")
      } else {
        setMessage("Failed to detect devices. Ensure the NAPS2 sidecar is bundled correctly.")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      localStorage.setItem("selected_scanner", selectedScanner)
      localStorage.setItem("selected_printer", selectedPrinter)
      localStorage.setItem("ocr_enabled", String(ocrEnabled))
      setMessage("Settings saved successfully!")
    } catch (err) {
      setMessage("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Detecting devices...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your scanner, printer, and OCR preferences.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md text-sm ${message.includes("Failed") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Scanner</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Scanner</label>
            <Select value={selectedScanner} onValueChange={setSelectedScanner} disabled={!isWindows}>
              <SelectTrigger>
                <SelectValue placeholder={isWindows ? "Select a scanner" : "Available on Windows only"} />
              </SelectTrigger>
              <SelectContent>
                {!isWindows ? (
                  <SelectItem value="none" disabled>Scanning is only available on Windows</SelectItem>
                ) : scanners.length === 0 ? (
                  <SelectItem value="none" disabled>No scanners detected</SelectItem>
                ) : (
                  scanners.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {isWindows
                ? "Scanners are detected via the bundled NAPS2 sidecar. No additional installation required."
                : "Scanning requires Windows and is not available on this platform."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Printer</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Printer</label>
            <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a printer" />
              </SelectTrigger>
              <SelectContent>
                {printers.length === 0 ? (
                  <SelectItem value="none" disabled>No printers detected</SelectItem>
                ) : (
                  printers.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name} {p.is_default ? "(Default)" : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This printer will be used when you print faxes from the preview.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">OCR</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable OCR for scanned documents</p>
              <p className="text-xs text-muted-foreground">
                When enabled, scanned documents will be processed with OCR to make them searchable.
              </p>
            </div>
            <Switch
              checked={ocrEnabled}
              onCheckedChange={setOcrEnabled}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
