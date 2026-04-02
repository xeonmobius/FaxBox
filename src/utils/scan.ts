import { invoke } from "@tauri-apps/api/core"

export async function scanToPdf(): Promise<string> {
  const scanner = localStorage.getItem("selected_scanner") || ""
  const ocr = localStorage.getItem("ocr_enabled") === "true"
  const tempDir = await invoke<string>("get_temp_dir")
  const outputPath = `${tempDir}/faxbox_scan_${Date.now()}.pdf`
  return await invoke<string>("scan_document", {
    scanner,
    outputPath,
    ocr,
  })
}
