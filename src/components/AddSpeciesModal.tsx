import React, { useState, useRef } from 'react';
import { X, Plus, Upload, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { CactusSpecies, TOTAL_LEVELS } from '../data/cactusSpecies';

interface AddSpeciesModalProps {
  defaultLevel: number;
  onClose: () => void;
  onCreateSpecies: (
    data: {
      genus: string;
      species: string;
      subfamily: CactusSpecies['subfamily'];
      tribe: string;
      origin: string;
      growthForm: CactusSpecies['growthForm'];
      level: number;
    },
    initialPhotoData?: string,
    initialNotes?: string
  ) => Promise<void>;
}

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

export const AddSpeciesModal: React.FC<AddSpeciesModalProps> = ({
  defaultLevel,
  onClose,
  onCreateSpecies,
}) => {
  const [genus, setGenus] = useState('');
  const [speciesEpithet, setSpeciesEpithet] = useState('');
  const [subfamily, setSubfamily] = useState<CactusSpecies['subfamily']>('Cactoideae');
  const [tribe, setTribe] = useState('Cacteae');
  const [origin, setOrigin] = useState('México');
  const [growthForm, setGrowthForm] = useState<CactusSpecies['growthForm']>('Globosa');
  const [level, setLevel] = useState<number>(
    defaultLevel >= 1 && defaultLevel <= TOTAL_LEVELS ? defaultLevel : 1
  );

  const [photoData, setPhotoData] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
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
    setPhotoData(trimmed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanGenus = genus.trim();
    const cleanSpecies = speciesEpithet.trim().toLowerCase();

    if (!cleanGenus || !cleanSpecies) {
      setErrorMsg('Ingresa tanto el género como el epíteto específico.');
      return;
    }

    const formattedGenus =
      cleanGenus.charAt(0).toUpperCase() + cleanGenus.slice(1).toLowerCase();

    setSaving(true);
    try {
      await onCreateSpecies(
        {
          genus: formattedGenus.slice(0, 80),
          species: cleanSpecies.slice(0, 80),
          subfamily,
          tribe: (tribe.trim() || 'Cacteae').slice(0, 80),
          origin: (origin.trim() || 'América').slice(0, 160),
          growthForm,
          level,
        },
        photoData.trim() || undefined,
        notes.trim() || undefined
      );
      onClose();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Error al agregar la nueva especie.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <span className="text-xs font-mono text-emerald-700 font-semibold">
              Nueva Especie de Cactácea
            </span>
            <h2 className="text-lg font-bold text-stone-900">
              Agregar especie al catálogo
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Género *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={genus}
                onChange={(e) => setGenus(e.target.value)}
                placeholder="Ej. Mammillaria"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Epíteto específico (especie) *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={speciesEpithet}
                onChange={(e) => setSpeciesEpithet(e.target.value)}
                placeholder="Ej. herrerae"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Subfamilia
              </label>
              <select
                value={subfamily}
                onChange={(e) =>
                  setSubfamily(e.target.value as CactusSpecies['subfamily'])
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Cactoideae">Cactoideae</option>
                <option value="Opuntioideae">Opuntioideae</option>
                <option value="Pereskioideae">Pereskioideae</option>
                <option value="Maihuenioideae">Maihuenioideae</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Forma de crecimiento
              </label>
              <select
                value={growthForm}
                onChange={(e) =>
                  setGrowthForm(e.target.value as CactusSpecies['growthForm'])
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Globosa">Globosa</option>
                <option value="Columnar">Columnar</option>
                <option value="Cladodio (Opuntioide)">Cladodio (Opuntioide)</option>
                <option value="Epífita">Epífita</option>
                <option value="Geófita / Cespitosa">Geófita / Cespitosa</option>
                <option value="Arbustiva / Foliar">Arbustiva / Foliar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tribu
              </label>
              <input
                type="text"
                maxLength={80}
                value={tribe}
                onChange={(e) => setTribe(e.target.value)}
                placeholder="Ej. Cacteae"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Origen / Distribución
              </label>
              <input
                type="text"
                maxLength={160}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ej. Querétaro, México"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nivel asignado
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Nivel {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Photo right when creating */}
          <div className="border-t border-stone-200 pt-3 space-y-3">
            <label className="block text-xs font-medium text-stone-700">
              Fotografía inicial (opcional — puedes dejarla vacía o subirla ahora)
            </label>

            {photoData && (
              <div className="w-full h-40 rounded-lg overflow-hidden bg-stone-900 flex items-center justify-center">
                <img
                  src={photoData}
                  alt="Vista previa"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
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
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-200 text-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir foto desde dispositivo</span>
              </button>

              <div className="flex flex-1 gap-1.5">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="O pegar URL de imagen..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-200 text-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Usar</span>
                </button>
              </div>
            </div>

            <input
              type="text"
              maxLength={1000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas botánicas opcionales..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

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
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Agregar especie</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
