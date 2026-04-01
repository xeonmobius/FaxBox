import { execSync } from "child_process"
import fs from "fs"
import path from "path"
import https from "https"
import { createWriteStream } from "fs"
import { pipeline } from "stream/promises"

if (process.platform !== "win32") {
  console.log("[naps2-setup] Skipping — Windows only.")
  process.exit(0)
}

const NAPS2_VERSION = "8.2.1"
const NAPS2_URL = `https://github.com/cyanfish/naps2/releases/download/v${NAPS2_VERSION}/naps2-${NAPS2_VERSION}-win-x64.exe`
const BINARY_NAME = "naps2-console"
const TARGET_TRIPLE = "x86_64-pc-windows-msvc"

const projectRoot = path.resolve(import.meta.dirname, "..")
const binariesDir = path.join(projectRoot, "src-tauri", "binaries")
const outputDir = path.join(binariesDir, `${BINARY_NAME}-${TARGET_TRIPLE}`)
const installerPath = path.join(binariesDir, `naps2-${NAPS2_VERSION}-win-x64.exe`)

function log(msg) {
  console.log(`[naps2-setup] ${msg}`)
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    const request = https.get(url, { headers: { "User-Agent": "FaxBox-Setup" } }, (response) => {
      if ((response.statusCode === 302 || response.statusCode === 301) && response.headers.location) {
        request.destroy()
        https.get(response.headers.location, { headers: { "User-Agent": "FaxBox-Setup" } }, (redirected) => {
          pipeline(redirected, file).then(resolve).catch(reject)
        }).on("error", reject)
        return
      }
      pipeline(response, file).then(resolve).catch(reject)
    })
    request.on("error", reject)
  })
}

function get7zipPath() {
  try {
    const sevenZipBin = require.resolve("7zip-bin")
    const sevenZipModule = require(sevenZipBin)
    return sevenZipModule.path7za || sevenZipModule.path7x
  } catch {
    return null
  }
}

async function extractInstaller(installer, dest) {
  const sevenZipPath = get7zipPath()

  if (!sevenZipPath || !fs.existsSync(sevenZipPath)) {
    log("7zip-bin not available. Please install it: npm install 7zip-bin")
    return false
  }

  log(`Extracting with 7zip: ${sevenZipPath}`)
  try {
    execSync(`"${sevenZipPath}" x "${installer}" -o"${dest}" -y`, { stdio: "inherit" })
    return true
  } catch (e) {
    log("7zip extraction failed")
    return false
  }
}

async function main() {
  if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0) {
    log("NAPS2 binaries already exist, skipping extraction.")
    return
  }

  fs.mkdirSync(binariesDir, { recursive: true })
  fs.mkdirSync(outputDir, { recursive: true })

  if (!fs.existsSync(installerPath)) {
    log(`Downloading NAPS2 ${NAPS2_VERSION} Windows installer...`)
    log(`URL: ${NAPS2_URL}`)
    await download(NAPS2_URL, installerPath)
    log("Download complete.")
  }

  const extractSuccess = await extractInstaller(installerPath, outputDir)

  if (!extractSuccess) {
    log("Extraction failed. Cleaning up.")
    if (fs.existsSync(installerPath)) {
      fs.unlinkSync(installerPath)
    }
    process.exit(1)
  }

  // 7zip extracts Inno Setup installers into a {app} subdirectory
  // Move contents up to the output directory
  const appDir = path.join(outputDir, "{app}")
  if (fs.existsSync(appDir)) {
    const files = fs.readdirSync(appDir)
    for (const file of files) {
      const src = path.join(appDir, file)
      const dst = path.join(outputDir, file)
      fs.renameSync(src, dst)
    }
    fs.rmdirSync(appDir)
    log("Moved extracted files from {app} to output directory.")
  }

  // Verify the console binary exists
  const consoleExe = path.join(outputDir, "NAPS2.Console.exe")
  if (fs.existsSync(consoleExe)) {
    const stats = fs.statSync(consoleExe)
    log(`NAPS2.Console.exe found (${(stats.size / 1024 / 1024).toFixed(1)}MB)`)
    log("Sidecar binary ready for Windows builds.")
  } else {
    log("Warning: NAPS2.Console.exe not found in extracted contents.")
    log("Contents of output directory:")
    try {
      const contents = fs.readdirSync(outputDir)
      contents.forEach((f) => log(`  - ${f}`))
    } catch {}
    log("The installer format may have changed. Check the NAPS2 releases page.")
  }

  // Clean up installer
  if (fs.existsSync(installerPath)) {
    fs.unlinkSync(installerPath)
    log("Cleaned up installer.")
  }
}

main().catch((err) => {
  console.error("NAPS2 setup failed:", err)
  process.exit(1)
})
