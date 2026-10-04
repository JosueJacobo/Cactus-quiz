import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Trash2, Check, Loader2, AlertCircle, Pencil } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';

interface PhotoEditorModalProps {
  species: CactusSpecies;
  initialPhotoData?: string;
  initialNotes?: string;
  onClose: () => void;
  onSave: (
    species: CactusSpecies,
    photoData: string,
    notes: string,
    updatedScientificName: string
  ) => Promise<void>;
  onDelete: (species: CactusSpecies) => Promise<void>;
}

/**
 * Compresses an uploaded image file into a clean JPEG data URL under ~450KB
 * so it fits comfortably inside Firestore's 1MB document limit and 750,000 char rule limit.
 */
async function compressImageFile(file: File, maxDimension = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no válido.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        if (dataUrl.length > 700000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        }
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  species,
  initialPhotoData = '',
  initialNotes = '',
  onClose,
  onSave,
  onDelete,
}) => {
  const [scientificName, setScientificName] = useState(species.scientificName);
  const [photoData, setPhotoData] = useState(initialPhotoData);
  const [notes, setNotes] = useState(initialNotes);
  const [urlInput, setUrlInput] = useState(
    initialPhotoData.startsWith('http') ? initialPhotoData : ''
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      const compressed = await compressImageFile(file);
      setPhotoData(compressed);
      setUrlInput('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al procesar la imagen.');
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 750000) {
      setErrorMsg('La URL o imagen excede el tamaño máximo permitido.');
      return;
    }
    setPhotoData(trimmed);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanedName = scientificName.trim();
    if (cleanedName.length < 2) {
      setErrorMsg('El nombre científico debe tener al menos 2 caracteres.');
      return;
    }
    if (photoData.length > 750000) {
      setErrorMsg('La imagen es demasiado grande. Intenta con otra imagen.');
      return;
    }
    setSaving(true);
    try {
      await onSave(
        species,
        photoData.trim(),
        notes.trim().slice(0, 1000),
        cleanedName.slice(0, 160)
      );
      onClose();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Error al guardar en la base de datos.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!initialPhotoData) {
      setPhotoData('');
      return;
    }
    setErrorMsg(null);
    setDeleting(true);
    try {
      await onDelete(species);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al eliminar la foto.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-stone-50">
          <div>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              Editar Especie #{String(species.index).padStart(4, '0')} · Nivel {species.level}
            </span>
            <h2 className="text-base font-bold italic text-stone-900">
              {scientificName || species.scientificName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Editable Scientific Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
              <Pencil className="w-3.5 h-3.5 text-emerald-700" />
              <span>Nombre científico (Género y especie)</span>
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={160}
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              placeholder="Ej. Ariocarpus retusus"
              className="w-full px-3 py-2 text-sm font-semibold italic rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Preview Frame */}
          <div className="w-full h-48 rounded-lg overflow-hidden bg-stone-100 border border-stone-300 flex items-center justify-center relative">
            {photoData ? (
              <img
                src={photoData}
                alt={scientificName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain bg-stone-900"
              />
            ) : (
              <div className="text-center text-stone-400 p-4">
                <p className="text-sm font-medium">Sin foto personalizada (opcional)</p>
                <p className="text-xs mt-1">
                  Puedes guardar solo el nuevo nombre o también subir/pegar una foto
                </p>
              </div>
            )}
          </div>

          {/* Upload from device */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Subir foto del dispositivo</span>
            </button>

            {photoData && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleRemove}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Quitar foto</span>
              </button>
            )}
          </div>

          {/* Or paste URL */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              O pegar URL directa de imagen
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/foto-cactus.jpg"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 rounded-lg bg-stone-200 text-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Usar URL</span>
              </button>
            </div>
          </div>

          {/* Optional botanical notes */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Notas botánicas / localidad (opcional, máx. 1000 caracteres)
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Ejemplar fotografiado en Tehuacán, Puebla..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
