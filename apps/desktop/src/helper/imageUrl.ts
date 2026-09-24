import { getServerUrl } from '../services/store.service';
import { Producto } from '../interface';

/**
 * Normaliza y devuelve una URL válida para mostrar una imagen.
 * Soporta URLs absolutas (http/https), blob (URL.createObjectURL), data URLs (base64)
 * y rutas relativas del backend (/uploads/...) resolviendo contra el server_url configurado.
 */
export const getProductImageUrl = (ruta?: string | null): string | null => {
  if (!ruta) return null;
  const trimmed = ruta.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const serverUrl = getServerUrl();
  if (!serverUrl) return trimmed;

  const base = serverUrl.replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${cleanPath}`;
};

/**
 * Obtiene la ruta de la imagen principal o primera imagen del producto si existe.
 */
export const getProductoMainImage = (producto?: Producto | null): string | null => {
  if (!producto) return null;
  if (producto.imagenes && producto.imagenes.length > 0) {
    const principal = producto.imagenes.find((img) => img.EsPrincipal);
    return principal ? principal.RutaArchivo : producto.imagenes[0].RutaArchivo;
  }
  return producto.imagen || (producto as any).Imagen || (producto as any).RutaArchivo || null;
};
