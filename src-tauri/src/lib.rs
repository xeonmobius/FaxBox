use serde::{Deserialize, Serialize};
use std::env;
use tauri_plugin_shell::ShellExt;

use printers::{get_default_printer, get_printer_by_name, get_printers};
use printers::common::base::job::PrinterJobOptions;

#[derive(Serialize, Deserialize)]
pub struct DeviceInfo {
    pub name: String,
    pub is_default: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_temp_dir() -> String {
    env::temp_dir().to_string_lossy().to_string()
}

#[tauri::command]
fn list_printers() -> Result<Vec<DeviceInfo>, String> {
    let printers_list = get_printers();
    let default_name = get_default_printer().map(|p| p.name);
    Ok(printers_list
        .into_iter()
        .map(|p| {
            let is_default = default_name.as_ref().map_or(false, |d| d == &p.name);
            DeviceInfo {
                name: p.name,
                is_default,
            }
        })
        .collect())
}

#[tauri::command]
fn print_pdf(file_path: &str, printer_name: &str) -> Result<String, String> {
    let printer = get_printer_by_name(printer_name)
        .ok_or_else(|| format!("Printer '{}' not found", printer_name))?;
    let job_id = printer
        .print_file(file_path, PrinterJobOptions::none())
        .map_err(|e| format!("Print failed: {:?}", e))?;
    Ok(job_id.to_string())
}

#[tauri::command]
async fn scan_document(
    app: tauri::AppHandle,
    scanner: &str,
    output_path: &str,
    ocr: bool,
) -> Result<String, String> {
    if !cfg!(target_os = "windows") {
        return Err("Scanning is only available on Windows.".into());
    }

    let cmd = app
        .shell()
        .sidecar("naps2-console")
        .map_err(|e| e.to_string())?;

    let cmd = cmd.arg("-o").arg(output_path).arg("-p").arg(scanner);

    let cmd = if ocr {
        cmd.arg("--enableocr")
    } else {
        cmd
    };

    let output = cmd
        .output()
        .await
        .map_err(|e| format!("Failed to run NAPS2 sidecar: {}", e))?;

    if output.status.success() {
        Ok(output_path.to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        Err(format!("Scan failed: {}{}", stderr, stdout))
    }
}

#[tauri::command]
async fn list_scanners(app: tauri::AppHandle) -> Result<Vec<DeviceInfo>, String> {
    if !cfg!(target_os = "windows") {
        return Err("Scanning is only available on Windows.".into());
    }

    let output = app
        .shell()
        .sidecar("naps2-console")
        .map_err(|e| e.to_string())?
        .arg("--listdevices")
        .output()
        .await
        .map_err(|e| format!("Failed to run NAPS2 sidecar: {}", e))?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let devices: Vec<DeviceInfo> = stdout
            .lines()
            .filter(|l| !l.trim().is_empty() && !l.contains("-->"))
            .map(|l| DeviceInfo {
                name: l.trim().to_string(),
                is_default: false,
            })
            .collect();
        Ok(devices)
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to list scanners: {}", stderr))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_temp_dir,
            list_printers,
            print_pdf,
            scan_document,
            list_scanners
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
