import React, { useState } from 'react';
import { ArrowLeft, Trash2, Star, Check, X } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord, GameModeId, LevelProgressMap } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';

interface LevelMenuProps {
  level: number; // 0 = Todas (1400), 1..14 = Nivel 1..14
  pool: CactusSpecies[];
  photosMap: Record<string, CustomPhotoRecord>;
  progressMap: LevelProgressMap;
  isOwner: boolean;
  onSelectMode: (mode: GameModeId) => void;
  onResetLevelProgress: (level: number) => void;
  onOpenEditor: (species: CactusSpecies) => void;
  onBackToLevels: () => void;
}

interface ModeRowConfig {
  id: GameModeId;
  title: string;
  subtitleType: 'progress_record' | 'fraction' | 'record_only' | 'none';
  sampleIndexOffset: number;
}

const MODE_ROWS: ModeRowConfig[] = [
  { id: 'four_words', title: '4 Palabras', subtitleType: 'progress_record', sampleIndexOffset: 0 },
  { id: 'four_images', title: '4 Imágenes', subtitleType: 'progress_record', sampleIndexOffset: 1 },
  { id: 'spelling_easy', title: 'Prueba (Fácil)', subtitleType: 'fraction', sampleIndexOffset: 2 },
  { id: 'six_images', title: 'Seis', subtitleType: 'progress_record', sampleIndexOffset: 3 },
  { id: 'time_words', title: '4 Palabras : 1 Minuto', subtitleType: 'record_only', sampleIndexOffset: 4 },
  { id: 'time_images', title: '4 Imágenes : 1 Minuto', subtitleType: 'record_only', sampleIndexOffset: 5 },
  { id: 'spelling_hard', title: 'Prueba (Difícil)', subtitleType: 'fraction', sampleIndexOffset: 6 },
  { id: 'flashcards', title: 'Tarjetas', subtitleType: 'none', sampleIndexOffset: 7 },
  { id: 'table', title: 'Tabla', subtitleType: 'none', sampleIndexOffset: 8 },
];

export const LevelMenu: React.FC<LevelMenuProps> = ({
  level,
  pool,
  photosMap,
  progressMap,
  isOwner,
  onSelectMode,
  onResetLevelProgress,
  onOpenEditor,
  onBackToLevels,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const levelTitle = level === 0 ? 'Todas (1400)' : `Nivel ${level}`;

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100 pb-6">
      {/* Header matching screenshot 3 ("Nivel 1" + blue trash icon) */}
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToLevels}
              className="p-1.5 rounded-lg text-stone-900 hover:bg-stone-200 transition-colors"
              aria-label="Cambiar nivel"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-normal text-stone-900">{levelTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {confirmReset ? (
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-stone-300 shadow-xs">
                <span className="text-xs text-stone-700 mr-1">¿Reiniciar progreso?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetLevelProgress(level);
                    setConfirmReset(false);
                  }}
                  className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                  title="Confirmar reinicio"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                  title="Cancelar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                title="Reiniciar récords de este nivel"
                className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 9 White Cards matching screenshot 3 */}
      <div className="px-2.5 space-y-2.5 mt-1">
        {MODE_ROWS.map((row) => {
          const sampleSpecies = pool[row.sampleIndexOffset % pool.length];
          const statKey = `${level}_${row.id}`;
          const stat = progressMap[statKey] || { progress: 0, record: 0 };
          const totalInLevel = pool.length;
          const isComplete =
            row.subtitleType === 'fraction'
              ? stat.progress >= totalInLevel
              : row.subtitleType === 'progress_record'
              ? stat.record >= totalInLevel
              : stat.record >= 20;

          let subtitle = '';
          if (row.subtitleType === 'progress_record') {
            subtitle = `Progreso: ${stat.progress}, Récord: ${stat.record}`;
          } else if (row.subtitleType === 'fraction') {
            subtitle = `${stat.progress}/${totalInLevel}`;
          } else if (row.subtitleType === 'record_only') {
            subtitle = `Récord: ${stat.record}`;
          }

          return (
            <div
              key={row.id}
              onClick={() => onSelectMode(row.id)}
              className="bg-white rounded-md border border-stone-200/90 shadow-xs hover:shadow-md transition-all px-2.5 py-2 flex items-center justify-between cursor-pointer active:bg-stone-50"
            >
              {/* Left square rounded thumbnail */}
              <CactusPhotoFrame
                species={sampleSpecies}
                photoData={photosMap[sampleSpecies.id]?.photoData}
                isOwner={isOwner}
                onEditClick={(sp) => onOpenEditor(sp)}
                compact={true}
                className="w-16 h-16 rounded-xl shrink-0"
              />

              {/* Center Title & Progress */}
              <div className="flex-1 text-center px-3">
                <h2 className="text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                  {row.title}
                </h2>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-stone-700 mt-0.5 tabular-nums">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Right Star icon (for quiz modes 1..7) */}
              <div className="w-8 flex items-center justify-end shrink-0">
                {row.subtitleType !== 'none' && (
                  <Star
                    className={`w-6 h-6 ${
                      isComplete
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-stone-800'
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
