import React, { useState, useEffect, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  Lightbulb,
  LogIn,
  LogOut,
  ShieldCheck,
  Lock,
  Layers,
  BookOpen,
  Plus,
  ExternalLink,
  Copy,
  Check,
  X,
  WifiOff,
  HardDriveDownload,
  Loader2,
  KeyRound,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  OWNER_EMAIL,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  ALL_CACTUS_SPECIES,
  CactusSpecies,
  TOTAL_LEVELS,
} from './data/cactusSpecies';
import {
  CustomPhotoRecord,
  CustomSpeciesRecord,
  DeletedSpeciesRecord,
  GameModeId,
  LevelProgressMap,
} from './types/quiz';
import { LevelMenu } from './components/LevelMenu';
import { MultipleChoiceMode } from './components/MultipleChoiceMode';
import { SpellingMode } from './components/SpellingMode';
import { TimeChallengeMode } from './components/TimeChallengeMode';
import { FlashcardsMode } from './components/FlashcardsMode';
import { TableMode } from './components/TableMode';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { AddSpeciesModal } from './components/AddSpeciesModal';
import { CactusPhotoFrame } from './components/CactusPhotoFrame';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useOnlineStatus } from './hooks/usePWAInstall';
import {
  fetchWikiPhotosBatch,
  getCachedWikiPhoto,
} from './utils/wikiPhotos';
import {
  preloadAllOfflineImagesIntoMemory,
  saveOfflineImage,
  cacheRemoteImageOffline,
  getMemoryOfflineImage,
} from './utils/offlineImageStore';

const LOCAL_PROGRESS_KEY = 'cactaceas_quiz_progress_v1';
const LOCAL_HINTS_KEY = 'cactaceas_quiz_hints_v1';
const FIREBASE_PROJECT_ID = 'shining-lamp-qjq9c';
const EXPECTED_EDITOR_HASH =
  'a79928133a6b6e0d4a46542369c3998138e04b7ef91bc16c3e266be46a20b56d';

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [unauthorizedDomainHost, setUnauthorizedDomainHost] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Whether the current signed-in user has an entry in /admins/{uid}
  const [isAuthorizedAdminDoc, setIsAuthorizedAdminDoc] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activatingEditor, setActivatingEditor] = useState(false);

  // Realtime maps from Firestore (persisted in IndexedDB via persistentLocalCache)
  const [photosMap, setPhotosMap] = useState<Record<string, CustomPhotoRecord>>({});
  const [customSpeciesMap, setCustomSpeciesMap] = useState<Record<string, CustomSpeciesRecord>>({});
  const [deletedSpeciesMap, setDeletedSpeciesMap] = useState<Record<string, boolean>>({});
  const [wikiLoadedTick, setWikiLoadedTick] = useState(0);

  // Global offline download progress
  const [downloadingAllOffline, setDownloadingAllOffline] = useState(false);
  const [downloadAllStatus, setDownloadAllStatus] = useState<string | null>(null);

  // Navigation state: null = Level Selector overview, 0..14 = inside a specific level
  const [selectedLevel, setSelectedLevel] = useState<number | null>(1);
  const [activeMode, setActiveMode] = useState<GameModeId | null>(null);

  // Modals for owner
  const [editingSpecies, setEditingSpecies] = useState<CactusSpecies | null>(null);
  const [showAddSpeciesModal, setShowAddSpeciesModal] = useState(false);

  // Hints (lightbulbs)
  const [hints, setHints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_HINTS_KEY);
      return saved !== null ? parseInt(saved, 10) : 88;
    } catch {
      return 88;
    }
  });

  // Progress & records per level/mode
  const [progressMap, setProgressMap] = useState<LevelProgressMap>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load all previously saved offline images from IndexedDB into memory on boot
  useEffect(() => {
    preloadAllOfflineImagesIntoMemory().then(() => {
      setWikiLoadedTick((t) => t + 1);
    });
  }, []);

  // Track Firebase Auth state & check any pending redirect result
  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      handleAuthErrorObject(err);
    });

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser) {
        setAuthError(null);
        setUnauthorizedDomainHost(null);
      } else {
        setIsAuthorizedAdminDoc(false);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to /admins/{uid} for the currently logged-in user so any linked account works
  useEffect(() => {
    if (!user) {
      setIsAuthorizedAdminDoc(false);
      return;
    }
    const adminDocRef = doc(db, 'admins', user.uid);
    const unsub = onSnapshot(
      adminDocRef,
      (snap) => {
        setIsAuthorizedAdminDoc(snap.exists());
      },
      () => {
        setIsAuthorizedAdminDoc(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Subscribe to custom cactus photos in Firestore (also saves them to offline IndexedDB store)
  useEffect(() => {
    if (!authReady) return;
    const publicPhotosQuery = query(
      collection(db, 'cactus_photos'),
      where('isPublic', '==', true)
    );
    const unsub = onSnapshot(
      publicPhotosQuery,
      (snap) => {
        const next: Record<string, CustomPhotoRecord> = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data() as CustomPhotoRecord;
          if (data && data.speciesId) {
            next[data.speciesId] = data;
            if (data.photoData) {
              if (data.photoData.startsWith('data:')) {
                saveOfflineImage(data.speciesId, data.photoData);
              } else {
                cacheRemoteImageOffline(data.speciesId, data.photoData);
              }
            }
          }
        });
        setPhotosMap(next);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'cactus_photos');
      }
    );
    return () => unsub();
  }, [authReady]);

  // Subscribe to custom added cactus species in Firestore
  useEffect(() => {
    if (!authReady) return;
    const customSpeciesQuery = query(
      collection(db, 'cactus_custom_species'),
      where('isPublic', '==', true)
    );
    const unsub = onSnapshot(
      customSpeciesQuery,
      (snap) => {
        const next: Record<string, CustomSpeciesRecord> = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data() as CustomSpeciesRecord;
          if (data && data.speciesId) {
            next[data.speciesId] = data;
          }
        });
        setCustomSpeciesMap(next);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'cactus_custom_species');
      }
    );
    return () => unsub();
  }, [authReady]);

  // Subscribe to deleted base species in Firestore
  useEffect(() => {
    if (!authReady) return;
    const deletedSpeciesQuery = query(
      collection(db, 'cactus_deleted_species'),
      where('isPublic', '==', true)
    );
    const unsub = onSnapshot(
      deletedSpeciesQuery,
      (snap) => {
        const next: Record<string, boolean> = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data() as DeletedSpeciesRecord;
          if (data && data.speciesId) {
            next[data.speciesId] = true;
          }
        });
        setDeletedSpeciesMap(next);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'cactus_deleted_species');
      }
    );
    return () => unsub();
  }, [authReady]);

  // Combined dynamic catalog: (Base 1400 - Deleted) + Custom Added Species + Renamed overrides
  const activeCatalog = useMemo<CactusSpecies[]>(() => {
    const baseFiltered = ALL_CACTUS_SPECIES.filter(
      (sp) => !deletedSpeciesMap[sp.id]
    ).map((sp) => {
      const overrideName = photosMap[sp.id]?.scientificName?.trim();
      if (overrideName && overrideName !== sp.scientificName) {
        const parts = overrideName.split(/\s+/);
        return {
          ...sp,
          scientificName: overrideName,
          genus: parts[0] || sp.genus,
          species: parts.slice(1).join(' ') || sp.species,
        };
      }
      return sp;
    });

    const customList: CactusSpecies[] = Object.values(customSpeciesMap)
      .filter((c) => !deletedSpeciesMap[c.speciesId])
      .map((c, idx) => {
        const overrideName =
          photosMap[c.speciesId]?.scientificName?.trim() || c.scientificName;
        const parts = overrideName.split(/\s+/);
        return {
          id: c.speciesId,
          index: 1401 + idx,
          level: c.level >= 1 && c.level <= TOTAL_LEVELS ? c.level : 14,
          genus: parts[0] || c.genus,
          species: parts.slice(1).join(' ') || c.species,
          scientificName: overrideName,
          subfamily: c.subfamily,
          tribe: c.tribe,
          origin: c.origin,
          growthForm: c.growthForm,
        };
      });

    const combined = [...baseFiltered, ...customList];
    return combined.map((item, i) => ({
      ...item,
      index: i + 1,
    }));
  }, [customSpeciesMap, deletedSpeciesMap, photosMap]);

  const getActiveSpeciesForLevel = (level: number): CactusSpecies[] => {
    if (level === 0) return activeCatalog;
    return activeCatalog.filter((sp) => sp.level === level);
  };

  // Preload royalty-free Wikimedia Commons photos and cache active level images in IndexedDB
  useEffect(() => {
    if (!isOnline) return;
    let cancelled = false;
    const activePool =
      selectedLevel !== null && selectedLevel > 0
        ? getActiveSpeciesForLevel(selectedLevel)
        : getActiveSpeciesForLevel(1);

    (async () => {
      await fetchWikiPhotosBatch(activePool.map((s) => s.scientificName));
      if (!cancelled) setWikiLoadedTick((t) => t + 1);

      for (const sp of activePool) {
        if (cancelled) break;
        const wikiUrl = getCachedWikiPhoto(sp.scientificName);
        if (wikiUrl && !getMemoryOfflineImage(sp.scientificName)) {
          await cacheRemoteImageOffline(sp.scientificName, wikiUrl);
        }
      }
      if (!cancelled) setWikiLoadedTick((t) => t + 1);

      for (let lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
        if (cancelled) break;
        const lvlPool = getActiveSpeciesForLevel(lvl);
        await fetchWikiPhotosBatch(lvlPool.map((s) => s.scientificName));
        if (!cancelled) setWikiLoadedTick((t) => t + 1);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedLevel, activeCatalog.length, isOnline]);

  // Persist hints and progress locally
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_HINTS_KEY, String(hints));
    } catch {
      // ignore storage errors
    }
  }, [hints]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progressMap));
    } catch {
      // ignore storage errors
    }
  }, [progressMap]);

  // Owner check: Either primary email (emiliojacobg@gmail.com) OR any secondary Google account linked in /admins/{uid}
  const isOwner = Boolean(
    user &&
      ((user.emailVerified &&
        user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) ||
        isAuthorizedAdminDoc)
  );

  const handleActivateSecondaryAccountAsEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAuthError(null);
    setActivatingEditor(true);

    try {
      const hash = await sha256Hex(pinCode);
      if (hash !== EXPECTED_EDITOR_HASH) {
        setAuthError('La clave de propietario no coincide.');
        return;
      }

      const path = `admins/${user.uid}`;
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          email: (user.email || 'editor@cactaceas.app').slice(0, 254),
          accessHash: hash,
          createdAt: serverTimestamp(),
        });
        setShowPinInput(false);
        setPinCode('');
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    } finally {
      setActivatingEditor(false);
    }
  };

  const handleAuthErrorObject = (err: unknown) => {
    const code = (err as { code?: string })?.code || '';
    const msg = err instanceof Error ? err.message : String(err);

    if (code === 'auth/unauthorized-domain' || msg.includes('auth/unauthorized-domain')) {
      const host = window.location.hostname || 'josuejacobo.github.io';
      setUnauthorizedDomainHost(host);
      setAuthError(
        `El dominio "${host}" aún no está autorizado en Firebase Authentication.`
      );
      return;
    }

    if (code === 'auth/popup-closed-by-user') {
      setAuthError('Cerraste la ventana de inicio de sesión antes de completar el acceso.');
      return;
    }

    setAuthError(msg || 'No se pudo iniciar sesión con Google.');
  };

  const handleLogin = async () => {
    setAuthError(null);
    setUnauthorizedDomainHost(null);
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirErr) {
          handleAuthErrorObject(redirErr);
          return;
        }
      }
      handleAuthErrorObject(err);
    }
  };

  const handleLogout = async () => {
    setAuthError(null);
    setUnauthorizedDomainHost(null);
    setShowPinInput(false);
    await signOut(auth);
  };

  const handleCopyDomain = () => {
    if (!unauthorizedDomainHost) return;
    navigator.clipboard?.writeText(unauthorizedDomainHost);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const handleSavePhoto = async (
    species: CactusSpecies,
    photoData: string,
    notes: string,
    updatedScientificName?: string
  ) => {
    if (!user || !isOwner) {
      throw new Error('Solo una cuenta autorizada como Editor puede guardar o editar especies.');
    }
    const finalName = (updatedScientificName?.trim() || species.scientificName).slice(0, 160);
    if (photoData) {
      await saveOfflineImage(species.id, photoData);
    }

    const path = `cactus_photos/${species.id}`;
    try {
      const payload: Record<string, unknown> = {
        speciesId: species.id,
        scientificName: finalName,
        photoData: photoData.slice(0, 750000),
        isPublic: true,
        updatedBy: user.uid,
        updatedAt: serverTimestamp(),
      };
      if (notes) {
        payload.notes = notes.slice(0, 1000);
      }
      await setDoc(doc(db, 'cactus_photos', species.id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    // If this is a custom species, also update its custom_species document
    if (species.id.startsWith('custom_') && customSpeciesMap[species.id] && finalName !== species.scientificName) {
      const parts = finalName.split(/\s+/);
      const existingCustom = customSpeciesMap[species.id];
      const customPath = `cactus_custom_species/${species.id}`;
      try {
        await setDoc(doc(db, 'cactus_custom_species', species.id), {
          ...existingCustom,
          scientificName: finalName,
          genus: (parts[0] || existingCustom.genus).slice(0, 80),
          species: (parts.slice(1).join(' ') || existingCustom.species).slice(0, 80),
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, customPath);
      }
    }
  };

  const handleCreateCustomSpecies = async (
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
  ) => {
    if (!user || !isOwner) {
      throw new Error('Solo una cuenta autorizada como Editor puede agregar nuevas especies.');
    }
    const scientificName = `${data.genus} ${data.species}`.slice(0, 160);
    const speciesId = `custom_${Date.now()}`;
    const speciesPath = `cactus_custom_species/${speciesId}`;

    try {
      await setDoc(doc(db, 'cactus_custom_species', speciesId), {
        speciesId,
        scientificName,
        genus: data.genus.slice(0, 80),
        species: data.species.slice(0, 80),
        subfamily: data.subfamily,
        tribe: data.tribe.slice(0, 80),
        origin: data.origin.slice(0, 160),
        growthForm: data.growthForm,
        level: data.level,
        isPublic: true,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, speciesPath);
    }

    if (initialPhotoData) {
      await saveOfflineImage(speciesId, initialPhotoData);
      const photoPath = `cactus_photos/${speciesId}`;
      try {
        const photoPayload: Record<string, unknown> = {
          speciesId,
          scientificName,
          photoData: initialPhotoData.slice(0, 750000),
          isPublic: true,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        };
        if (initialNotes) {
          photoPayload.notes = initialNotes.slice(0, 1000);
        }
        await setDoc(doc(db, 'cactus_photos', speciesId), photoPayload);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, photoPath);
      }
    }
  };

  const handleDeleteSpecies = async (species: CactusSpecies) => {
    if (!user || !isOwner) {
      throw new Error('Solo una cuenta autorizada como Editor puede eliminar especies.');
    }

    if (species.id.startsWith('custom_') && customSpeciesMap[species.id]) {
      const customPath = `cactus_custom_species/${species.id}`;
      try {
        await deleteDoc(doc(db, 'cactus_custom_species', species.id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, customPath);
      }
    } else {
      const deletedPath = `cactus_deleted_species/${species.id}`;
      try {
        await setDoc(doc(db, 'cactus_deleted_species', species.id), {
          speciesId: species.id,
          isPublic: true,
          deletedBy: user.uid,
          deletedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, deletedPath);
      }
    }
  };

  const handleSyncFreePhotosToFirestore = async (
    speciesList: CactusSpecies[]
  ): Promise<number> => {
    if (!user || !isOwner) {
      throw new Error('Solo una cuenta autorizada como Editor puede sincronizar fotos.');
    }
    await fetchWikiPhotosBatch(speciesList.map((s) => s.scientificName));
    let savedCount = 0;
    for (const sp of speciesList) {
      if (photosMap[sp.id]?.photoData) continue;
      const freeUrl = getCachedWikiPhoto(sp.scientificName);
      if (!freeUrl) continue;
      const path = `cactus_photos/${sp.id}`;
      try {
        await setDoc(doc(db, 'cactus_photos', sp.id), {
          speciesId: sp.id,
          scientificName: sp.scientificName.slice(0, 160),
          photoData: freeUrl.slice(0, 750000),
          notes: 'Fotografía libre de Wikimedia Commons',
          isPublic: true,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
        savedCount++;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }
    return savedCount;
  };

  const handleDeletePhoto = async (species: CactusSpecies) => {
    if (!user || !isOwner) {
      throw new Error('Solo una cuenta autorizada como Editor puede eliminar fotos.');
    }
    const path = `cactus_photos/${species.id}`;
    try {
      await deleteDoc(doc(db, 'cactus_photos', species.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleDownloadEntireCatalogOffline = async () => {
    if (downloadingAllOffline) return;
    setDownloadingAllOffline(true);
    try {
      const total = activeCatalog.length;
      let saved = 0;
      const chunkSize = 10;
      for (let i = 0; i < total; i += chunkSize) {
        const batch = activeCatalog.slice(i, i + chunkSize);
        await fetchWikiPhotosBatch(batch.map((s) => s.scientificName));
        await Promise.all(
          batch.map(async (sp) => {
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
        setDownloadAllStatus(`Guardando fotos offline: ${Math.min(total, i + chunkSize)}/${total}`);
      }
      setWikiLoadedTick((t) => t + 1);
      setDownloadAllStatus(`¡${saved} fotos guardadas en la app para usar sin internet!`);
      setTimeout(() => setDownloadAllStatus(null), 5000);
    } finally {
      setDownloadingAllOffline(false);
    }
  };

  const handleSpendHints = (amount: number): boolean => {
    if (hints < amount) return false;
    setHints((prev) => prev - amount);
    return true;
  };

  const handleEarnHints = (amount: number) => {
    setHints((prev) => prev + amount);
  };

  const handleUpdateScore = (level: number, mode: GameModeId, score: number) => {
    const key = `${level}_${mode}`;
    setProgressMap((prev) => {
      const existing = prev[key] || { progress: 0, record: 0 };
      return {
        ...prev,
        [key]: {
          progress: score,
          record: Math.max(existing.record, score),
        },
      };
    });
  };

  const handleResetLevelProgress = (level: number) => {
    setProgressMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${level}_`)) {
          delete next[k];
        }
      });
      return next;
    });
  };

  const totalFilledPhotos = useMemo(() => {
    let count = 0;
    for (const sp of activeCatalog) {
      if (
        photosMap[sp.id]?.photoData ||
        getMemoryOfflineImage(sp.id) ||
        getMemoryOfflineImage(sp.scientificName) ||
        getCachedWikiPhoto(sp.scientificName)
      ) {
        count++;
      }
    }
    return count;
  }, [activeCatalog, photosMap, wikiLoadedTick]);

  const currentPool = useMemo(() => {
    if (selectedLevel === null) return activeCatalog;
    return getActiveSpeciesForLevel(selectedLevel);
  }, [selectedLevel, activeCatalog]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Clean Top Bar Contract: Zone 1 Brand | Zone 2 Nav | Zone 3 Actions */}
      <header className="bg-white border-b border-stone-200 px-4 py-2.5 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveMode(null);
              setSelectedLevel(1);
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap cursor-pointer"
          >
            Cactáceas: Foto-Quiz
          </button>

          {/* Zone 2: Clean navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => {
                setActiveMode(null);
                setSelectedLevel(null);
              }}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                selectedLevel === null && !activeMode ? 'text-stone-900 underline underline-offset-4' : ''
              }`}
            >
              14 Niveles ({activeCatalog.length} Especies)
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedLevel === null) setSelectedLevel(1);
                setActiveMode(null);
              }}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                selectedLevel !== null && !activeMode ? 'text-stone-900 underline underline-offset-4' : ''
              }`}
            >
              Modos de Juego
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel(0);
                setActiveMode('table');
              }}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                activeMode === 'table' ? 'text-stone-900 underline underline-offset-4' : ''
              }`}
            >
              Catálogo Completo ({totalFilledPhotos}/{activeCatalog.length} con foto)
            </button>
          </nav>

          {/* Zone 3: Primary actions (Hints + Install PWA + Owner Google Auth) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-medium text-stone-700 tabular-nums px-2 py-1">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{hints}</span>
            </div>

            <PWAInstallButton />

            {isOwner && (
              <button
                type="button"
                onClick={() => setShowAddSpeciesModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors whitespace-nowrap"
                title="Agregar una nueva especie de cactácea al catálogo"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nueva especie</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span
                  className="hidden lg:inline-flex items-center gap-1 text-xs text-stone-600"
                  title={user.email || ''}
                >
                  {isOwner ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span className="truncate max-w-[130px]">
                    {isOwner ? 'Modo Editor Activo' : 'Solo lectura'}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Acceso Editor</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Offline status indicator */}
      {!isOnline && (
        <div className="bg-stone-800 text-white px-4 py-1.5 text-center text-xs flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Modo sin internet activo — Mostrando las especies e imágenes guardadas en este dispositivo.
          </span>
        </div>
      )}

      {downloadAllStatus && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 text-center text-xs text-emerald-900 font-medium">
          {downloadAllStatus}
        </div>
      )}

      {/* Secondary Google Account Editor Activation Banner */}
      {user && !isOwner && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Iniciaste sesión con <strong>{user.email}</strong> (Modo lectura). ¿Es tu otra cuenta?
            </span>

            {!showPinInput ? (
              <button
                type="button"
                onClick={() => setShowPinInput(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Habilitar esta cuenta como Editor</span>
              </button>
            ) : (
              <form
                onSubmit={handleActivateSecondaryAccountAsEditor}
                className="flex items-center gap-1.5"
              >
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Tu clave o correo propietario..."
                  className="px-2.5 py-1 rounded border border-amber-400 bg-white text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={activatingEditor}
                  className="px-2.5 py-1 rounded bg-emerald-700 text-white font-medium hover:bg-emerald-800 disabled:opacity-50"
                >
                  {activatingEditor ? '...' : 'Activar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinInput(false)}
                  className="p-1 text-stone-600 hover:text-stone-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Helpful step-by-step banner if GitHub Pages domain is not yet authorized in Firebase */}
      {unauthorizedDomainHost ? (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 text-xs text-stone-800">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-amber-900">
                Falta autorizar el dominio <code>{unauthorizedDomainHost}</code> en Firebase:
              </p>
              <ol className="list-decimal list-inside text-stone-700 space-y-0.5">
                <li>
                  Abre <strong>Firebase Console</strong> con la cuenta propietaria del proyecto (<code>emiliojacobg@gmail.com</code>).
                </li>
                <li>
                  En <strong>Authentication → Settings → Authorized domains</strong> haz clic en <strong>Add domain</strong> y pega:{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono">
                    {unauthorizedDomainHost}
                  </code>
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyDomain}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 font-medium hover:bg-stone-100 transition-colors"
              >
                {copiedDomain ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedDomain ? 'Copiado' : 'Copiar dominio'}</span>
              </button>

              <a
                href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
              >
                <span>Abrir Firebase Auth</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setUnauthorizedDomainHost(null);
                  setAuthError(null);
                }}
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        authError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-center text-xs text-red-700 flex items-center justify-center gap-2">
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="p-0.5 rounded hover:bg-red-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Level Selector Directory */}
        {selectedLevel === null && !activeMode && (
          <div className="max-w-3xl mx-auto p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-300">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">
                  {activeCatalog.length.toLocaleString()} Especies de Cactáceas (Cactaceae)
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  Organizadas en 14 niveles por nombre científico ·{' '}
                  <span className="font-semibold text-emerald-800 tabular-nums">
                    {totalFilledPhotos} de {activeCatalog.length} con foto libre o propia
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  disabled={downloadingAllOffline}
                  onClick={handleDownloadEntireCatalogOffline}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                  title="Guardar todas las imágenes disponibles en el dispositivo para usarlas sin internet"
                >
                  {downloadingAllOffline ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <HardDriveDownload className="w-4 h-4" />
                  )}
                  <span>
                    {downloadingAllOffline
                      ? 'Descargando fotos...'
                      : 'Guardar todas las fotos offline'}
                  </span>
                </button>

                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setShowAddSpeciesModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Especie</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevel(0);
                    setActiveMode('table');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Ver Tabla Completa</span>
                </button>
              </div>
            </div>

            {/* All Species Mega-Level Card */}
            <div
              onClick={() => setSelectedLevel(0)}
              className="bg-white rounded-lg border-2 border-emerald-700/80 shadow-xs hover:shadow-md transition-all p-3.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Layers className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Todas las {activeCatalog.length.toLocaleString()} Especies (Modo Global)
                  </h2>
                  <p className="text-xs text-stone-600">
                    Juega o administra todas las especies combinadas (con y sin internet)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-800 font-semibold tabular-nums">
                {totalFilledPhotos}/{activeCatalog.length} fotos
              </span>
            </div>

            {/* 14 Levels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((lvl) => {
                const lvlSpecies = getActiveSpeciesForLevel(lvl);
                if (lvlSpecies.length === 0) return null;
                const firstSp = lvlSpecies[0];
                const lastSp = lvlSpecies[lvlSpecies.length - 1];
                const filledInLvl = lvlSpecies.filter(
                  (s) =>
                    Boolean(photosMap[s.id]?.photoData) ||
                    Boolean(getMemoryOfflineImage(s.id)) ||
                    Boolean(getMemoryOfflineImage(s.scientificName)) ||
                    Boolean(getCachedWikiPhoto(s.scientificName))
                ).length;

                const coverSpecies =
                  lvlSpecies.find(
                    (s) =>
                      Boolean(photosMap[s.id]?.photoData) ||
                      Boolean(getMemoryOfflineImage(s.id)) ||
                      Boolean(getMemoryOfflineImage(s.scientificName)) ||
                      Boolean(getCachedWikiPhoto(s.scientificName))
                  ) || firstSp;

                return (
                  <div
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className="bg-white rounded-lg border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-2.5 flex items-center gap-3 cursor-pointer"
                  >
                    <CactusPhotoFrame
                      species={coverSpecies}
                      photoData={photosMap[coverSpecies.id]?.photoData}
                      isOwner={isOwner}
                      onEditClick={(sp) => setEditingSpecies(sp)}
                      compact={true}
                      className="w-16 h-16 rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-stone-900">
                          Nivel {lvl}
                        </h3>
                        <span className="text-xs font-mono text-stone-500 tabular-nums">
                          {lvlSpecies.length} especies
                        </span>
                      </div>
                      <p className="text-xs italic text-stone-600 truncate">
                        {firstSp.scientificName} … {lastSp.scientificName}
                      </p>
                      <p className="text-xs text-stone-500 mt-1 tabular-nums">
                        Con foto: {filledInLvl}/{lvlSpecies.length} · Faltan: {lvlSpecies.length - filledInLvl}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Level 9-Mode Menu */}
        {selectedLevel !== null && !activeMode && (
          <LevelMenu
            level={selectedLevel}
            pool={currentPool}
            photosMap={photosMap}
            progressMap={progressMap}
            isOwner={isOwner}
            onSelectMode={(mode) => setActiveMode(mode)}
            onResetLevelProgress={handleResetLevelProgress}
            onOpenEditor={(sp) => setEditingSpecies(sp)}
            onBackToLevels={() => setSelectedLevel(null)}
          />
        )}

        {/* Active Quiz / Study Modes */}
        {selectedLevel !== null &&
          (activeMode === 'four_words' ||
            activeMode === 'four_images' ||
            activeMode === 'six_images') && (
            <MultipleChoiceMode
              mode={activeMode}
              levelTitle={selectedLevel === 0 ? `Todas (${activeCatalog.length})` : `Nivel ${selectedLevel}`}
              pool={currentPool}
              photosMap={photosMap}
              hints={hints}
              isOwner={isOwner}
              onSpendHints={handleSpendHints}
              onEarnHints={handleEarnHints}
              onUpdateScore={(score) => handleUpdateScore(selectedLevel, activeMode, score)}
              onOpenEditor={(sp) => setEditingSpecies(sp)}
              onBack={() => setActiveMode(null)}
            />
          )}

        {selectedLevel !== null &&
          (activeMode === 'spelling_easy' || activeMode === 'spelling_hard') && (
            <SpellingMode
              difficulty={activeMode === 'spelling_easy' ? 'easy' : 'hard'}
              pool={currentPool}
              photosMap={photosMap}
              hints={hints}
              isOwner={isOwner}
              onSpendHints={handleSpendHints}
              onEarnHints={handleEarnHints}
              onUpdateScore={(score) => handleUpdateScore(selectedLevel, activeMode, score)}
              onOpenEditor={(sp) => setEditingSpecies(sp)}
              onBack={() => setActiveMode(null)}
            />
          )}

        {selectedLevel !== null &&
          (activeMode === 'time_words' || activeMode === 'time_images') && (
            <TimeChallengeMode
              subMode={activeMode === 'time_words' ? 'words' : 'images'}
              pool={currentPool}
              photosMap={photosMap}
              isOwner={isOwner}
              onEarnHints={handleEarnHints}
              onUpdateRecord={(score) => handleUpdateScore(selectedLevel, activeMode, score)}
              onOpenEditor={(sp) => setEditingSpecies(sp)}
              onBack={() => setActiveMode(null)}
            />
          )}

        {selectedLevel !== null && activeMode === 'flashcards' && (
          <FlashcardsMode
            pool={currentPool}
            photosMap={photosMap}
            isOwner={isOwner}
            onOpenEditor={(sp) => setEditingSpecies(sp)}
            onBack={() => setActiveMode(null)}
          />
        )}

        {selectedLevel !== null && activeMode === 'table' && (
          <TableMode
            levelTitle={selectedLevel === 0 ? `Todas (${activeCatalog.length} especies)` : `Nivel ${selectedLevel}`}
            pool={currentPool}
            photosMap={photosMap}
            isOwner={isOwner}
            onOpenEditor={(sp) => setEditingSpecies(sp)}
            onOpenAddSpecies={() => setShowAddSpeciesModal(true)}
            onDeleteSpecies={handleDeleteSpecies}
            onSyncFreePhotosToFirestore={handleSyncFreePhotosToFirestore}
            onBack={() => setActiveMode(null)}
          />
        )}
      </main>

      {/* Owner-only Photo Upload / Edit Modal */}
      {editingSpecies && isOwner && (
        <PhotoEditorModal
          species={editingSpecies}
          initialPhotoData={
            photosMap[editingSpecies.id]?.photoData ||
            getMemoryOfflineImage(editingSpecies.id) ||
            getMemoryOfflineImage(editingSpecies.scientificName) ||
            getCachedWikiPhoto(editingSpecies.scientificName) ||
            ''
          }
          initialNotes={photosMap[editingSpecies.id]?.notes}
          onClose={() => setEditingSpecies(null)}
          onSave={handleSavePhoto}
          onDelete={handleDeletePhoto}
        />
      )}

      {/* Owner-only Add New Species Modal */}
      {showAddSpeciesModal && isOwner && (
        <AddSpeciesModal
          defaultLevel={selectedLevel && selectedLevel > 0 ? selectedLevel : 1}
          onClose={() => setShowAddSpeciesModal(false)}
          onCreateSpecies={handleCreateCustomSpecies}
        />
      )}
    </div>
  );
}
