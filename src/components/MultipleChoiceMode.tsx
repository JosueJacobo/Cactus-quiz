import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lightbulb, Heart, RotateCcw } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';

interface MultipleChoiceModeProps {
  mode: 'four_words' | 'four_images' | 'six_images';
  levelTitle: string;
  pool: CactusSpecies[];
  photosMap: Record<string, CustomPhotoRecord>;
  hints: number;
  isOwner: boolean;
  onSpendHints: (amount: number) => boolean;
  onEarnHints: (amount: number) => void;
  onUpdateScore: (score: number) => void;
  onOpenEditor: (species: CactusSpecies) => void;
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const MultipleChoiceMode: React.FC<MultipleChoiceModeProps> = ({
  mode,
  pool,
  photosMap,
  hints,
  isOwner,
  onSpendHints,
  onEarnHints,
  onUpdateScore,
  onOpenEditor,
  onBack,
}) => {
  const optionCount = mode === 'six_images' ? 6 : 4;
  const questionsOrder = useMemo(() => shuffleArray(pool), [pool]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const targetSpecies = questionsOrder[currentIndex % questionsOrder.length];

  const options = useMemo(() => {
    if (!targetSpecies) return [];
    const others = pool.filter((s) => s.id !== targetSpecies.id);
    const distractors = shuffleArray(others).slice(0, optionCount - 1);
    return shuffleArray([targetSpecies, ...distractors]);
  }, [targetSpecies, pool, optionCount]);

  useEffect(() => {
    setWrongIds([]);
    setSolved(false);
  }, [currentIndex]);

  const handleSelectOption = (chosen: CactusSpecies) => {
    if (solved || gameOver || wrongIds.includes(chosen.id)) return;

    if (chosen.id === targetSpecies.id) {
      setSolved(true);
      const nextScore = score + 1;
      setScore(nextScore);
      onUpdateScore(nextScore);
      if (nextScore % 5 === 0) {
        onEarnHints(2);
      }
      setTimeout(() => {
        if (currentIndex + 1 >= questionsOrder.length) {
          setGameOver(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 320);
    } else {
      setWrongIds((prev) => [...prev, chosen.id]);
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setTimeout(() => setGameOver(true), 350);
      }
    }
  };

  const handleUseFiftyFiftyHint = () => {
    if (solved || gameOver) return;
    const availableDistractors = options.filter(
      (o) => o.id !== targetSpecies.id && !wrongIds.includes(o.id)
    );
    if (availableDistractors.length === 0) return;
    if (!onSpendHints(2)) return;
    const toEliminate = availableDistractors
      .slice(0, Math.min(2, availableDistractors.length))
      .map((o) => o.id);
    setWrongIds((prev) => [...prev, ...toEliminate]);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setWrongIds([]);
    setSolved(false);
    setGameOver(false);
  };

  const progressPercent = Math.min(100, ((currentIndex + (solved ? 1 : 0)) / questionsOrder.length) * 100);

  if (gameOver) {
    return (
      <div className="max-w-lg mx-auto bg-stone-100 min-h-[80vh] flex flex-col justify-between p-4">
        <div className="bg-white rounded-xl border border-stone-200 p-6 text-center shadow-sm my-auto">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            {lives > 0 ? '¡Nivel completado!' : 'Fin de la partida'}
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            Aciertos logrados: <span className="font-bold text-stone-900 tabular-nums">{score}</span> de{' '}
            <span className="tabular-nums">{questionsOrder.length}</span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100 transition-colors"
            >
              Volver al menú
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar de nuevo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100">
      {/* Classic Photo-Quiz Top HUD */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-stone-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleUseFiftyFiftyHint}
            title="Usar pista (2 bombillas) para descartar opciones"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-amber-100/70 transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-lg font-medium text-stone-800 tabular-nums">{hints}</span>
          </button>
        </div>

        <div className="text-xl font-medium text-stone-900 tabular-nums">{score + 1}</div>

        <div className="flex items-center gap-1">
          {[1, 2, 3].map((heartIdx) => (
            <Heart
              key={heartIdx}
              className={`w-6 h-6 transition-transform ${
                heartIdx <= lives
                  ? 'text-red-600 fill-red-600'
                  : 'text-stone-300 fill-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thin Progress Line */}
      <div className="px-3 mb-2">
        <div className="w-full h-1.5 bg-stone-400/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mode Layout */}
      {mode === 'four_words' && (
        <div className="flex-1 flex flex-col justify-between px-3 pb-4 gap-3">
          <div className="bg-stone-300 p-2 rounded-sm shadow-inner">
            <CactusPhotoFrame
              species={targetSpecies}
              photoData={photosMap[targetSpecies.id]?.photoData}
              isOwner={isOwner}
              onEditClick={(sp) => onOpenEditor(sp)}
              hideNameOverlay={true}
              className="w-full h-64 sm:h-72 rounded-xs bg-stone-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5 mt-auto">
            {options.map((opt) => {
              const isWrong = wrongIds.includes(opt.id);
              const isRight = solved && opt.id === targetSpecies.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isWrong || solved}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full py-3.5 px-4 rounded-md border text-center text-lg font-medium italic transition-colors shadow-xs ${
                    isRight
                      ? 'bg-green-600 text-white border-green-700'
                      : isWrong
                      ? 'bg-red-100 text-red-400 border-red-200 line-through opacity-55'
                      : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-50 active:bg-stone-200'
                  }`}
                >
                  {opt.scientificName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'four_images' && (
        <div className="flex-1 flex flex-col justify-between px-3 pb-4">
          {/* Prompt scientific name in center top area like screenshot 4 */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 italic px-2">
              {targetSpecies.scientificName}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {targetSpecies.subfamily} · {targetSpecies.origin}
            </p>
          </div>

          {/* 2x2 Image Grid at Bottom */}
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => {
              const isWrong = wrongIds.includes(opt.id);
              const isRight = solved && opt.id === targetSpecies.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-2 rounded-xs transition-all cursor-pointer ${
                    isRight
                      ? 'bg-green-600 ring-2 ring-green-600'
                      : isWrong
                      ? 'bg-red-200 opacity-35 pointer-events-none'
                      : 'bg-stone-300 hover:bg-stone-400/70'
                  }`}
                >
                  <CactusPhotoFrame
                    species={opt}
                    photoData={photosMap[opt.id]?.photoData}
                    isOwner={isOwner}
                    onEditClick={(sp) => onOpenEditor(sp)}
                    hideNameOverlay={false}
                    className="w-full h-40 sm:h-44"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'six_images' && (
        <div className="flex-1 flex flex-col justify-between px-2.5 pb-4">
          {/* 2x3 Grid on top like screenshot 1 ("Seis") */}
          <div className="grid grid-cols-2 gap-1.5">
            {options.map((opt) => {
              const isWrong = wrongIds.includes(opt.id);
              const isRight = solved && opt.id === targetSpecies.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-1.5 rounded-xs transition-all cursor-pointer ${
                    isRight
                      ? 'bg-green-600 ring-2 ring-green-600'
                      : isWrong
                      ? 'bg-red-200 opacity-35 pointer-events-none'
                      : 'bg-stone-300 hover:bg-stone-400/70'
                  }`}
                >
                  <CactusPhotoFrame
                    species={opt}
                    photoData={photosMap[opt.id]?.photoData}
                    isOwner={isOwner}
                    onEditClick={(sp) => onOpenEditor(sp)}
                    hideNameOverlay={false}
                    className="w-full h-32 sm:h-36"
                  />
                </div>
              );
            })}
          </div>

          {/* Prompt scientific name at bottom like screenshot 1 */}
          <div className="py-6 text-center my-auto">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 italic">
              {targetSpecies.scientificName}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {targetSpecies.growthForm} · {targetSpecies.origin}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
