import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import Swal from 'sweetalert2';

let hasCheckedForUpdates = false;

/**
 * Verifica si existe una nueva versión en GitHub Releases.
 * Se ejecuta únicamente una vez al iniciar la aplicación (a menos que se pase force = true).
 */
export const checkForAppUpdates = async (force = false): Promise<void> => {
  if (hasCheckedForUpdates && !force) {
    return;
  }
  hasCheckedForUpdates = true;

  try {
    const update = await check();

    if (!update || !update.available) {
      console.info('[Updater] La aplicación se encuentra en la última versión.');
      return;
    }

    // Preguntar al usuario si desea descargar la nueva versión
    const result = await Swal.fire({
      title: '¡Nueva versión disponible!',
      html: `
        <div style="text-align: left; font-size: 15px;">
          <p style="margin-bottom: 8px;">
            Hay una nueva versión disponible: <strong style="color: #f59e0b;">v${update.version}</strong>
          </p>
          ${
            update.body
              ? `<div style="max-height: 120px; overflow-y: auto; background: #f3f4f6; color: #374151; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin: 10px 0; border: 1px solid #e5e7eb; white-space: pre-wrap;">${update.body}</div>`
              : ''
          }
          <p style="margin-top: 8px; color: #4b5563;">¿Deseas descargarla e instalarla ahora?</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Descargar e instalar',
      cancelButtonText: 'Más tarde',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) {
      console.info('[Updater] El usuario decidió actualizar más tarde.');
      return;
    }

    // Mostrar modal con barra de progreso
    let downloaded = 0;
    let contentLength = 0;

    Swal.fire({
      title: 'Descargando actualización...',
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

    await update.downloadAndInstall((event) => {
      const textElem = document.getElementById('updater-progress-text');
      const barElem = document.getElementById('updater-progress-bar');

      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength || 0;
          if (textElem && contentLength > 0) {
            textElem.innerText = `0 MB de ${(contentLength / (1024 * 1024)).toFixed(1)} MB...`;
          }
          break;

        case 'Progress': {
          downloaded += event.data.chunkLength;
          if (contentLength > 0) {
            const percentage = Math.min(100, Math.round((downloaded / contentLength) * 100));
            if (textElem) {
              textElem.innerText = `${(downloaded / (1024 * 1024)).toFixed(1)} MB / ${(contentLength / (1024 * 1024)).toFixed(1)} MB (${percentage}%)`;
            }
            if (barElem) {
              barElem.style.width = `${percentage}%`;
            }
          } else if (textElem) {
            textElem.innerText = `${(downloaded / (1024 * 1024)).toFixed(1)} MB descargados...`;
          }
          break;
        }

        case 'Finished':
          if (textElem) {
            textElem.innerText = 'Instalando actualización...';
          }
          break;
      }
    });

    // Notificar éxito y reiniciar la aplicación
    await Swal.fire({
      title: '¡Actualización lista!',
      text: 'La nueva versión se instaló correctamente. La aplicación se reiniciará a continuación.',
      icon: 'success',
      confirmButtonText: 'Reiniciar ahora',
      confirmButtonColor: '#f59e0b',
      allowOutsideClick: false,
    });

    await relaunch();
  } catch (error) {
    // Manejo seguro en modo dev o si no hay conexión
    console.warn('[Updater] No se pudo verificar o aplicar la actualización:', error);
  }
};
