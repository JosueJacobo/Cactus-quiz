import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import {
  getCachedWikiPhoto,
  fetchWikiPhotosBatch,
  fetchCommonsPhotoSingle,
} from '../utils/wikiPhotos';
import {
  getMemoryOfflineImage,
  getOfflineImage,
  saveOfflineImage,
  cacheRemoteImageOffline,
} from '../utils/offlineImageStore';

interface CactusPhotoFrameProps {
  species: CactusSpecies;
  photoData?: string;
  isOwner: boolean;
  onEditClick?: (species: CactusSpecies, e: React.MouseEvent) => void;
  className?: string;
  compact?: boolean;
  hideNameOverlay?: boolean;
}

export const CactusPhotoFrame: React.FC<CactusPhotoFrameProps> = ({
  species,
  photoData,
  isOwner,
  onEditClick,
  className = '',
  compact = false,
  hideNameOverlay = false,
}) => {
  const [offlineDataUrl, setOfflineDataUrl] = useState<string | null>(() => {
    return (
      getMemoryOfflineImage(species.id) ||
      getMemoryOfflineImage(species.scientificName) ||
      null
    );
  });
  const [wikiPhoto, setWikiPhoto] = useState<string | null>(() => {
    const cached = getCachedWikiPhoto(species.scientificName);
    return cached ?? null;
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    let cancelled = false;

    (async () => {
      // 1. Check if owner provided a custom photo
      if (photoData && photoData.trim().length > 0) {
        if (photoData.startsWith('data:')) {
          await saveOfflineImage(species.id, photoData);
          if (!cancelled) setOfflineDataUrl(photoData);
          return;
        } else {
          const cachedCustom = await cacheRemoteImageOffline(species.id, photoData);
          if (!cancelled && cachedCustom) {
            setOfflineDataUrl(cachedCustom);
            return;
          }
        }
      }

      // 2. Check if already stored in IndexedDB offline image store
      const storedById = await getOfflineImage(species.id);
      if (storedById) {
        if (!cancelled) setOfflineDataUrl(storedById);
        return;
      }
      const storedByName = await getOfflineImage(species.scientificName);
      if (storedByName) {
        if (!cancelled) setOfflineDataUrl(storedByName);
        return;
      }

      // 3. Otherwise resolve from Wikimedia Commons / Wikipedia and save to IndexedDB for offline use
      let foundUrl = getCachedWikiPhoto(species.scientificName);
      if (foundUrl === undefined) {
        const batchRes = await fetchWikiPhotosBatch([species.scientificName]);
        foundUrl = batchRes[species.scientificName];
        if (!foundUrl) {
          foundUrl = await fetchCommonsPhotoSingle(species.scientificName);
        }
      }

      if (!cancelled) {
        setWikiPhoto(foundUrl ?? null);
      }

      if (foundUrl) {
        const savedBlobUrl = await cacheRemoteImageOffline(
          species.scientificName,
          foundUrl
        );
        if (!cancelled && savedBlobUrl) {
          setOfflineDataUrl(savedBlobUrl);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [species.id, species.scientificName, photoData]);

  const hasOwnerPhoto = Boolean(photoData && photoData.trim().length > 0);
  // Prefer local IndexedDB DataURL first so it always works offline
  const activePhotoUrl = !imgError
    ? offlineDataUrl || (hasOwnerPhoto ? photoData : wikiPhoto || undefined)
    : undefined;

  return (
    <div
      className={`relative overflow-hidden bg-stone-200/80 border border-stone-300 select-none flex items-center justify-center ${className}`}
    >
      {activePhotoUrl ? (
        <img
          src={activePhotoUrl}
          alt={species.scientificName}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-stone-100 to-stone-200 text-stone-500">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className={compact ? 'w-6 h-6 text-stone-400' : 'w-12 h-12 text-stone-400 mb-1.5'}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M32 56V14" />
            <path d="M26 56h12" />
            <path d="M32 38H20a6 6 0 0 1-6-6V22a4 4 0 0 1 8 0v8h10" />
            <path d="M32 32h12a6 6 0 0 0 6-6v-6a4 4 0 0 0-8 0v4H32" />
            <circle cx="32" cy="10" r="3" />
          </svg>
          {!compact && (
            <>
              <span className="text-[11px] font-mono text-stone-400 tabular-nums">
                #{String(species.index).padStart(4, '0')} · Sin foto libre
              </span>
              {!hideNameOverlay && (
                <span className="text-xs italic text-stone-500 font-medium line-clamp-1 mt-0.5 px-1">
                  {species.scientificName}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {!compact && activePhotoUrl && (
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/55 text-[10px] text-white/90 pointer-events-none">
          {offlineDataUrl
            ? hasOwnerPhoto
              ? 'Guardada Offline'
              : 'Wikimedia Offline'
            : 'Wikimedia Libre'}
        </span>
      )}

      {isOwner && onEditClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(species, e);
          }}
          title={`Subir o cambiar foto de ${species.scientificName}`}
          className={`absolute z-10 flex items-center gap-1 rounded-md bg-stone-900/80 text-white hover:bg-emerald-700 transition-colors shadow-sm ${
            compact ? 'bottom-0.5 right-0.5 p-1' : 'bottom-2 right-2 px-2.5 py-1.5 text-xs font-medium'
          }`}
        >
          {hasOwnerPhoto ? (
            <ImageIcon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          ) : (
            <Camera className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          )}
          {!compact && (
            <span>
              {hasOwnerPhoto
                ? 'Editar mi foto'
                : activePhotoUrl
                ? 'Reemplazar foto'
                : 'Llenar foto'}
            </span>
          )}
        </button>
      )}
    </div>
  );
};
