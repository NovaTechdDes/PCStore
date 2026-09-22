use futures_util::StreamExt;
use std::io::Write;
use tauri::{Emitter, Manager};

#[derive(Clone, serde::Serialize)]
struct DownloadProgressPayload {
    downloaded: u64,
    total: u64,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn toggle_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_devtools_open() {
            window.close_devtools();
        } else {
            window.open_devtools();
        }
    }
}

#[tauri::command]
async fn download_and_install_update(
    app: tauri::AppHandle,
    download_url: String,
    file_name: String,
) -> Result<(), String> {
    let _ = rustls::crypto::ring::default_provider().install_default();
    let client = reqwest::Client::new();
    let response = client
        .get(&download_url)
        .send()
        .await
        .map_err(|e| format!("Error al conectar con la URL de descarga: {}", e))?;

    if !response.status().is_success() {
        return Err(format!(
            "El servidor de descarga respondió con error: {}",
            response.status()
        ));
    }

    let total = response.content_length().unwrap_or(0);
    let mut downloaded: u64 = 0;

    let temp_dir = std::env::temp_dir();
    let target_file = temp_dir.join(&file_name);

    let mut file = std::fs::File::create(&target_file)
        .map_err(|e| format!("No se pudo crear el archivo temporal en disco: {}", e))?;

    let mut stream = response.bytes_stream();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| format!("Error durante la descarga: {}", e))?;
        file.write_all(&chunk)
            .map_err(|e| format!("Error al escribir datos en disco: {}", e))?;

        downloaded += chunk.len() as u64;

        let _ = app.emit(
            "update-download-progress",
            DownloadProgressPayload { downloaded, total },
        );
    }

    file.flush()
        .map_err(|e| format!("Error al finalizar el archivo: {}", e))?;
    drop(file);

    #[cfg(target_os = "windows")]
    {
        std::process::Command::new(&target_file)
            .spawn()
            .map_err(|e| format!("No se pudo ejecutar el instalador: {}", e))?;

        std::process::exit(0);
    }

    #[cfg(not(target_os = "windows"))]
    {
        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = rustls::crypto::ring::default_provider().install_default();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            download_and_install_update,
            toggle_devtools
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}




