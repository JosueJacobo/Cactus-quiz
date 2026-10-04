import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Camera,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Check,
  X,
  HardDriveDownload,
  Pencil,
} from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';
import {
  getCachedWikiPhoto,
  fetchWikiPhotosBatch,
} from '../utils/wikiPhotos';
import {
  getMemoryOfflineImage,
  cacheRemoteImageOffline,
  saveOfflineImage,
} from '../utils/offlineImageStore';

interface TableModeProps {
  levelTitle: string;
  pool: CactusSpecies[];
  photosMap: Record<string, CustomPhotoRecord>;
  isOwner: boolean;
  onOpenEditor: (species: CactusSpecies) => void;
  onOpenAddSpecies?: () => void;
  onDeleteSpecies?: (species: CactusSpecies) => Promise<void>;
  onSyncFreePhotosToFirestore?: (speciesList: CactusSpecies[]) => Promise<number>;
  onBack: () => void;
}

export const TableMode: React.FC<TableModeProps> = ({
  levelTitle,
  pool,
  photosMap,
  isOwner,
  onOpenEditor,
  onOpenAddSpecies,
  onDeleteSpecies,
  onSyncFreePhotosToFirestore,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'with_photo' | 'without_photo'>('all');
  const [wikiScanTick, setWikiScanTick] = useState(0);
  const [scanningFree, setScanningFree] = useState(false);
  const [syncingFirestore, setSyncingFirestore] = useState(false);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const names = pool.map((sp) => sp.scientificName);
    setScanningFree(true);
    fetchWikiPhotosBatch(names).finally(() => {
      if (!cancelled) {
        setScanningFree(false);
        setWikiScanTick((t) => t + 1);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pool]);

  const hasAnyPhoto = (sp: CactusSpecies): boolean => {
    if (photosMap[sp.id]?.photoData) return true;
    if (getMemoryOfflineImage(sp.id) || getMemoryOfflineImage(sp.scientificName)) return true;
    const wiki = getCachedWikiPhoto(sp.scientificName);
    return Boolean(wiki);
  };

  const filteredSpecies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pool.filter((sp) => {
      const hasPhoto = hasAnyPhoto(sp);
      if (photoFilter === 'with_photo' && !hasPhoto) return false;
      if (photoFilter === 'without_photo' && hasPhoto) return false;
      if (!q) return true;
      return (
        sp.scientificName.toLowerCase().includes(q) ||
        sp.genus.toLowerCase().includes(q) ||
        sp.tribe.toLowerCase().includes(q) ||
        sp.origin.toLowerCase().includes(q) ||
        String(sp.index).includes(q)
      );
    });
  }, [pool, photosMap, searchQuery, photoFilter, wikiScanTick]);

  const filledCountInPool = useMemo(() => {
    return pool.filter((sp) => hasAnyPhoto(sp)).length;
  }, [pool, photosMap, wikiScanTick]);

  const handleSaveFreeToFirestore = async () => {
    if (!onSyncFreePhotosToFirestore || syncingFirestore) return;
    setSyncingFirestore(true);
    setSyncMessage(null);
    try {
      const count = await onSyncFreePhotosToFirestore(pool);
      setSyncMessage(`Se guardaron ${count} fotos libres en tu base de datos.`);
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : 'Error al sincronizar fotos libres.'
      );
    } finally {
      setSyncingFirestore(false);
    }
  };

  const handleDownloadOfflinePack = async () => {
    if (downloadingOffline) return;
    setDownloadingOffline(true);
    setSyncMessage(null);

    try {
      await fetchWikiPhotosBatch(pool.map((s) => s.scientificName));
      let saved = 0;
      const total = pool.length;

      // Process in parallel chunks of 8 images
      const chunkSize = 8;
      for (let i = 0; i < total; i += chunkSize) {
        const slice = pool.slice(i, i + chunkSize);
        await Promise.all(
          slice.map(async (sp) => {
            const custom = photosMap[sp.id]?.photoData;
            if (custom) {
              if (custom.startsWith('data:')) {
                await saveOfflineImage(sp.id, custom);
                saved++;
              } else {
                const res = await cacheRemoteImageOffline(sp.id, custom);
                if (res) saved++;
              }
              return;
            }
            const wikiUrl = getCachedWikiPhoto(sp.scientificName);
            if (wikiUrl) {
              const res = await cacheRemoteImageOffline(sp.scientificName, wikiUrl);
              if (res) saved++;
            }
          })
        );
        setOfflineProgress(`${Math.min(total, i + chunkSize)}/${total}`);
      }

      setWikiScanTick((t) => t + 1);
      setSyncMessage(
        `¡Listo! ${saved} imágenes guardadas en este dispositivo para usar sin internet.`
      );
    } catch {
      setSyncMessage('Se guardaron las imágenes disponibles para uso sin conexión.');
    } finally {
      setDownloadingOffline(false);
      setOfflineProgress(null);
    }
  };

  const handleConfirmDelete = async (sp: CactusSpecies) => {
    if (!onDeleteSpecies) return;
    setDeletingId(sp.id);
    try {
      await onDeleteSpecies(sp);
      setConfirmDeleteId(null);
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : 'Error al eliminar la especie.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100">
      {/* Header */}
      <div className="px-3 pt-2.5 pb-2 sticky top-0 z-20 bg-stone-100">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-stone-800 gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-normal text-stone-900">
                Tabla · {levelTitle}
              </h1>
              <p className="text-xs text-stone-500 tabular-nums">
                {filledCountInPool} de {pool.length} con foto
                {scanningFree ? ' · Buscando fotos libres...' : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Button for ANY user to save all images in this level offline */}
            <button
              type="button"
              disabled={downloadingOffline}
              onClick={handleDownloadOfflinePack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors whitespace-nowrap"
              title="Descargar y guardar en la memoria de la app todas las fotos de este nivel para verlas sin internet"
            >
              {downloadingOffline ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <HardDriveDownload className="w-3.5 h-3.5" />
              )}
              <span>
                {downloadingOffline
                  ? `Guardando (${offlineProgress})...`
                  : 'Guardar fotos offline'}
              </span>
            </button>

            {isOwner && onOpenAddSpecies && (
              <button
                type="button"
                onClick={onOpenAddSpecies}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar especie</span>
              </button>
            )}

            {isOwner && onSyncFreePhotosToFirestore && (
              <button
                type="button"
                disabled={syncingFirestore}
                onClick={handleSaveFreeToFirestore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 disabled:opacity-50 transition-colors whitespace-nowrap"
                title="Guardar en Firestore todas las fotos libres de Wikimedia encontradas en este nivel"
              >
                {syncingFirestore ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Fijar en BD</span>
              </button>
            )}
          </div>
        </div>

        {syncMessage && (
          <div className="mt-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            {syncMessage}
          </div>
        )}

        {/* Search and Photo Filter Controls */}
        <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre científico, género, origen o #número..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-stone-200 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setPhotoFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                photoFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas ({pool.length})
            </button>
            <button
              type="button"
              onClick={() => setPhotoFilter('without_photo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                photoFilter === 'without_photo'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Faltantes ({pool.length - filledCountInPool})
            </button>
            <button
              type="button"
              onClick={() => setPhotoFilter('with_photo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                photoFilter === 'with_photo'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Con foto ({filledCountInPool})
            </button>
          </div>
        </div>
      </div>

      {/* Species List */}
      <div className="px-3 py-2 space-y-2">
        {filteredSpecies.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 p-8 text-center text-stone-500 text-sm">
            No se encontraron especies de cactáceas con ese filtro.
          </div>
        ) : (
          filteredSpecies.map((sp) => {
            const custom = photosMap[sp.id];
            const wikiPhoto = getCachedWikiPhoto(sp.scientificName);
            const isStoredOffline = Boolean(
              getMemoryOfflineImage(sp.id) || getMemoryOfflineImage(sp.scientificName)
            );
            const wikiUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(
              sp.scientificName.replace(/\s+/g, '_')
            )}`;
            const isConfirmingDelete = confirmDeleteId === sp.id;
            const isDeletingThis = deletingId === sp.id;

            return (
              <div
                key={sp.id}
                className="bg-white rounded-lg border border-stone-200/90 shadow-xs p-2.5 flex items-center gap-3.5"
              >
                <CactusPhotoFrame
                  species={sp}
                  photoData={custom?.photoData}
                  isOwner={isOwner}
                  onEditClick={(species) => onOpenEditor(species)}
                  hideNameOverlay={true}
                  className="w-24 h-24 sm:w-28 sm:h-24 rounded-md shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono tabular-nums">
                    <span>#{String(sp.index).padStart(4, '0')}</span>
                    <span>·</span>
                    <span>Nivel {sp.level}</span>
                    <span>·</span>
                    <span>
                      {isStoredOffline
                        ? 'Guardada sin internet'
                        : custom?.photoData
                        ? 'Foto propia'
                        : wikiPhoto
                        ? 'Foto libre (Wikimedia)'
                        : 'Sin foto (para llenar)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-semibold italic text-stone-900 truncate">
                      {sp.scientificName}
                    </h3>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => onOpenEditor(sp)}
                        className="p-1 rounded text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition-colors shrink-0"
                        title="Editar nombre científico o foto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 truncate">
                    {sp.growthForm} · {sp.origin}
                  </p>
                  {custom?.notes && (
                    <p className="text-xs text-emerald-800 mt-1 line-clamp-1">
                      Nota: {custom.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenEditor(sp)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {onDeleteSpecies &&
                        (isConfirmingDelete ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-1.5 py-1 rounded-md">
                            <span className="text-[11px] text-red-800 font-medium">¿Eliminar?</span>
                            <button
                              type="button"
                              disabled={isDeletingThis}
                              onClick={() => handleConfirmDelete(sp)}
                              className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                              title="Confirmar eliminación"
                            >
                              {isDeletingThis ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                              title="Cancelar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(sp.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-200 text-red-700 bg-red-50/60 text-xs hover:bg-red-100 transition-colors"
                            title={`Eliminar ${sp.scientificName} del catálogo`}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        ))}
                    </>
                  )}
                  <a
                    href={wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-300 text-stone-700 text-xs hover:bg-stone-100 transition-colors"
                  >
                    <span>Wiki</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
