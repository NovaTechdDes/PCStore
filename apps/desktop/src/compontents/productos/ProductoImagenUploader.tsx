import React, { useRef, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { mensaje } from '../../helper';

interface ProductoImagenUploaderProps {
  imagenPreview: string | null;
  imagenFile: File | null;
  imagenOriginalUrl: string | null;
  imagenEliminada: boolean;
  onSelectImage: (file: File) => void;
  onRemoveImage: () => void;
  onRestoreOriginal: () => void;
  isModifying: boolean;
}

const FORMATOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ProductoImagenUploader: React.FC<ProductoImagenUploaderProps> = ({
  imagenPreview,
  imagenFile,
  imagenOriginalUrl,
  imagenEliminada,
  onSelectImage,
  onRemoveImage,
  onRestoreOriginal,
  isModifying,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const procesarArchivo = (file: File) => {
    if (!FORMATOS_VALIDOS.includes(file.type)) {
      mensaje('Solo se permiten imágenes (PNG, JPG, WEBP)', 'warning');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      mensaje('La imagen no puede pesar más de 5MB', 'warning');
      return;
    }
    onSelectImage(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
    // Reset input value to allow selecting same file again if wanted
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  const formatearTamano = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const tieneImagen = Boolean(imagenPreview && !imagenEliminada);

  return (
    <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 relative pt-5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xs">
      {/* Etiqueta de la Sección */}
      <div className="absolute -top-2.5 left-3 bg-white dark:bg-[#18181b] px-2 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
        <PhotoCameraIcon sx={{ fontSize: 15 }} />
        <span>Imagen del Producto</span>
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Alerta de eliminación si se quitó la imagen original de un producto existente */}
      {imagenEliminada && imagenOriginalUrl && (
        <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 animate-fade-in">
          <div className="flex items-center gap-2">
            <DeleteIcon sx={{ fontSize: 18 }} />
            <span>La imagen actual será eliminada al guardar los cambios en este producto.</span>
          </div>
          <button
            type="button"
            onClick={onRestoreOriginal}
            className="flex items-center gap-1 font-semibold hover:underline text-red-700 dark:text-red-300 cursor-pointer"
          >
            <UndoIcon sx={{ fontSize: 16 }} />
            <span>Restaurar imagen anterior</span>
          </button>
        </div>
      )}

      {/* Caso 1: Hay una imagen seleccionada o cargada */}
      {tieneImagen ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800/80 rounded-xl">
          {/* Miniatura interactiva */}
          <div className="relative group shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shadow-xs">
            <img
              src={imagenPreview!}
              alt="Vista previa del producto"
              className="w-full h-full object-contain p-1 transition-transform duration-200 group-hover:scale-105"
            />

            {/* Overlay al hacer hover con botón para ampliar */}
            <div
              onClick={() => setShowLightbox(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
              title="Click para ver en tamaño completo"
            >
              <ZoomInIcon sx={{ fontSize: 28 }} />
            </div>

            {/* Badge de tipo de imagen */}
            <div className="absolute top-1 left-1 pointer-events-none">
              {imagenFile ? (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md shadow-xs flex items-center gap-0.5">
                  Nueva
                </span>
              ) : (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800/80 dark:bg-zinc-800/90 text-zinc-100 rounded-md backdrop-blur-xs">
                  Guardada
                </span>
              )}
            </div>
          </div>

          {/* Información y botones de acción */}
          <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
                  {imagenFile ? imagenFile.name : 'Imagen actual del producto'}
                </h4>
                {imagenFile && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    Lista
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {imagenFile
                  ? `Tamaño: ${formatearTamano(imagenFile.size)} · Formato: ${imagenFile.type.replace('image/', '').toUpperCase()}`
                  : isModifying
                    ? 'Esta es la imagen visible para el producto. Puedes reemplazarla o quitarla.'
                    : 'Imagen preparada para el nuevo producto.'}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CloudUploadIcon sx={{ fontSize: 16 }} />
                <span>Cambiar imagen</span>
              </button>

              <button
                type="button"
                onClick={onRemoveImage}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
                <span>Quitar</span>
              </button>

              {/* Si hay una nueva imagen seleccionada y existía una previa, opción de deshacer */}
              {imagenFile && imagenOriginalUrl && (
                <button
                  type="button"
                  onClick={onRestoreOriginal}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <UndoIcon sx={{ fontSize: 15 }} />
                  <span>Volver a la original</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Caso 2: Zona de arrastrar y soltar vacía */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 group ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-zinc-700/80 hover:border-amber-500/70 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-amber-500/5'
          }`}
        >
          <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
            <CloudUploadIcon sx={{ fontSize: 28 }} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200">
              <span className="text-amber-600 dark:text-amber-400 underline decoration-amber-500/40">
                Haz clic para examinar
              </span>{' '}
              o arrastra una imagen aquí
            </p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              Admite formatos JPG, PNG, WEBP (hasta 5 MB)
            </p>
          </div>
        </div>
      )}

      {/* Modal Lightbox para ver la imagen en tamaño completo */}
      {showLightbox && tieneImagen && (
        <div
          className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer z-10"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <img
              src={imagenPreview!}
              alt="Vista completa"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
