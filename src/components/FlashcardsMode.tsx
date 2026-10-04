import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';

interface FlashcardsModeProps {
  pool: CactusSpecies[];
  photosMap: Record<string, CustomPhotoRecord>;
  isOwner: boolean;
  onOpenEditor: (species: CactusSpecies) => void;
  onBack: () => void;
}

export const FlashcardsMode: React.FC<FlashcardsModeProps> = ({
  pool,
  photosMap,
  isOwner,
  onOpenEditor,
  onBack,
}) => {
  const [index, setIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const species = pool[index % pool.length];
  const customRecord = photosMap[species.id];
  const wikiUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(
    species.scientificName.replace(/\s+/g, '_')
  )}`;

  const handleNext = (knewIt: boolean) => {
    if (knewIt) {
      setKnownCount((c) => c + 1);
    } else {
      setReviewCount((c) => c + 1);
    }
    setIndex((prev) => (prev + 1) % pool.length);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100">
      {/* Header matching screenshot 5 ("Tarjetas") */}
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-normal text-stone-900">Tarjetas</h1>
          <span className="text-xs font-mono text-stone-500 tabular-nums">
            {index + 1}/{pool.length}
          </span>
        </div>
      </div>

      {/* Main White Card with "Wiki" oval button on top-right like screenshot 5 */}
      <div className="px-3 mt-2">
        <div className="relative bg-white rounded-xl border border-stone-200 shadow-sm p-4 pt-6 flex flex-col items-center">
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-4 z-20 px-5 py-2 rounded-full bg-gradient-to-b from-white to-stone-200 border-2 border-stone-500 shadow-md text-stone-900 font-semibold text-sm hover:from-stone-50 hover:to-stone-300 transition-all flex items-center gap-1"
          >
            <span>Wiki</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
          </a>

          <CactusPhotoFrame
            species={species}
            photoData={customRecord?.photoData}
            isOwner={isOwner}
            onEditClick={(sp) => onOpenEditor(sp)}
            hideNameOverlay={true}
            className="w-full h-64 sm:h-72 rounded-xs"
          />

          <div className="py-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-normal italic text-stone-900">
              {species.scientificName}
            </h2>
            <p className="text-xs text-stone-500 mt-1.5">
              Subfamilia {species.subfamily} · Tribu {species.tribe} · {species.growthForm}
            </p>
            <p className="text-xs text-stone-500 mt-0.5">{species.origin}</p>
            {customRecord?.notes && (
              <p className="mt-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                {customRecord.notes}
              </p>
            )}
          </div>

          {/* Navigation arrows inside card footer */}
          <div className="w-full flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev - 1 + pool.length) % pool.length)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <span className="font-mono tabular-nums">
              Especie #{String(species.index).padStart(4, '0')}
            </span>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1) % pool.length)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Two Square Buttons: Confused Red Face (???) & Happy Green Face (!!) like screenshot 5 */}
      <div className="flex items-center justify-center gap-16 py-8 mt-auto">
        <button
          type="button"
          onClick={() => handleNext(false)}
          title="No la conocía / Repasar"
          className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-stone-200 border-2 border-stone-400 shadow-md hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center"
        >
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <text x="14" y="16" fill="#b91c1c" fontSize="13" fontWeight="bold">?</text>
            <text x="29" y="12" fill="#b91c1c" fontSize="13" fontWeight="bold">?</text>
            <text x="44" y="16" fill="#b91c1c" fontSize="13" fontWeight="bold">?</text>
            <circle cx="32" cy="38" r="18" fill="none" stroke="#b91c1c" strokeWidth="3.5" />
            <circle cx="25" cy="34" r="2.5" fill="#b91c1c" />
            <circle cx="39" cy="34" r="2.5" fill="#b91c1c" />
            <line x1="24" y1="45" x2="40" y2="45" stroke="#b91c1c" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleNext(true)}
          title="¡Ya me la sé!"
          className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-stone-200 border-2 border-stone-400 shadow-md hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center"
        >
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <text x="48" y="20" fill="#15803d" fontSize="15" fontWeight="bold">!!</text>
            <circle cx="30" cy="36" r="18" fill="none" stroke="#15803d" strokeWidth="3.5" />
            <circle cx="23" cy="31" r="2.5" fill="#15803d" />
            <circle cx="37" cy="31" r="2.5" fill="#15803d" />
            <path
              d="M21 38 Q30 48 39 38"
              fill="none"
              stroke="#15803d"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {(knownCount > 0 || reviewCount > 0) && (
        <div className="text-center pb-3 text-xs text-stone-500 tabular-nums">
          Aprendidas: {knownCount} · Por repasar: {reviewCount}
        </div>
      )}
    </div>
  );
};
