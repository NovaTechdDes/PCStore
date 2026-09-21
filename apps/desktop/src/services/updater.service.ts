import api from "./api.service";
import { getServerUrl } from "./store.service";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getVersion } from "@tauri-apps/api/app";
import Swal from "sweetalert2";

let hasCheckedForUpdates = false;

interface CheckUpdateResponse {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes?: string;
  assetId?: number;
  fileName?: string;
  size?: number;
}

interface DownloadProgress {
  downloaded: number;
  total: number;
}

/**
 * Verifica si existe una nueva versión consultando a tu backend.
 * Se ejecuta únicamente al iniciar la aplicación (a menos que se pase force = true).
 */
export const checkForAppUpdates = async (force = false): Promise<void> => {
  if (hasCheckedForUpdates && !force) {
    return;
  }
  

  try {
    const serverUrl = getServerUrl();
    if (!serverUrl || serverUrl.trim() === "") {
      return;
    }
    hasCheckedForUpdates = true;

    let currentVersion = "0.0.0";
    try {
      currentVersion = await getVersion();
    } catch {
      currentVersion = "0.1.0";
    }

    // Consultar al backend propio (que tiene el token de GitHub protegido en su .env)
    const response = await api.get<CheckUpdateResponse>("/updates/check", {
      params: { currentVersion },
    });

    const data = response.data;
    if (!data || !data.updateAvailable || !data.assetId) {
      console.info("[Updater] La aplicación se encuentra en la última versión.");
      return;
    }

    // Preguntar al usuario si desea descargar la nueva versión
    const result = await Swal.fire({
      title: "¡Nueva versión disponible!",
      html: `
        <div style="text-align: left; font-size: 15px;">
          <p style="margin-bottom: 8px;">
            Hay una nueva versión disponible: <strong style="color: #f59e0b;">v${data.latestVersion}</strong>
          </p>
          ${
            data.releaseNotes
              ? `<div style="max-height: 120px; overflow-y: auto; background: #f3f4f6; color: #374151; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin: 10px 0; border: 1px solid #e5e7eb; white-space: pre-wrap;">${data.releaseNotes}</div>`
              : ""
          }
          <p style="margin-top: 8px; color: #4b5563;">¿Deseas descargarla e instalarla ahora?</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Descargar e instalar",
      cancelButtonText: "Más tarde",
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) {
      console.info("[Updater] El usuario decidió actualizar más tarde.");
      return;
    }

    // Mostrar modal con barra de progreso
    Swal.fire({
      title: "Descargando actualización...",
      html: `
        <div style="margin: 10px 0;">
          <div id="updater-progress-text" style="margin-bottom: 10px; font-size: 13px; color: #4b5563;">
            Iniciando descarga...
          </div>
          <div style="width: 100%; background: #e5e7eb; border-radius: 9999px; height: 12px; overflow: hidden;">
            <div id="updater-progress-bar" style="width: 0%; height: 100%; background: #f59e0b; transition: width 0.2s ease;"></div>
          </div>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Escuchar el progreso en vivo emitido desde Rust
    const unlisten = await listen<DownloadProgress>(
      "update-download-progress",
      (event) => {
        const { downloaded, total } = event.payload;
        const textElem = document.getElementById("updater-progress-text");
        const barElem = document.getElementById("updater-progress-bar");

        if (total > 0) {
          const percentage = Math.min(
            100,
            Math.round((downloaded / total) * 100)
          );
          if (textElem) {
            textElem.innerText = `${(downloaded / (1024 * 1024)).toFixed(
              1
            )} MB de ${(total / (1024 * 1024)).toFixed(1)} MB (${percentage}%)`;
          }
          if (barElem) {
            barElem.style.width = `${percentage}%`;
          }
        } else if (textElem) {
          textElem.innerText = `${(downloaded / (1024 * 1024)).toFixed(
            1
          )} MB descargados...`;
        }
      }
    );

    try {
      // URL completa para la descarga del instalador a través del backend
      const downloadUrl = `${serverUrl}/PCStore/updates/download/${
        data.assetId
      }?fileName=${encodeURIComponent(data.fileName || "update.exe")}`;

      // Descargar el archivo temporalmente y ejecutar el instalador
      await invoke("download_and_install_update", {
        downloadUrl,
        fileName: data.fileName || "update.exe",
      });
    } finally {
      unlisten();
    }
  } catch (error: any) {
    console.error("[Updater] Error al verificar o descargar actualización:", error);
    Swal.fire({
      title: "Error en la actualización",
      text:
        typeof error === "string"
          ? error
          : error?.message ||
            "No se pudo completar la descarga. Por favor, verifica la conexión con el servidor.",
      icon: "error",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Entendido",
    });
  }
};

