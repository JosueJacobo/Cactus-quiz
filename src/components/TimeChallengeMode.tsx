import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Timer, RotateCcw } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';

interface TimeChallengeModeProps {
  subMode: 'words' | 'images';
  pool: CactusSpecies[];
  photosMap: Record<string, CustomPhotoRecord>;
  isOwner: boolean;
  onEarnHints: (amount: number) => void;
  onUpdateRecord: (score: number) => void;
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

export const TimeChallengeMode: React.FC<TimeChallengeModeProps> = ({
  subMode,
  pool,
  photosMap,
  isOwner,
  onEarnHints,
  onUpdateRecord,
  onOpenEditor,
  onBack,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [questionTick, setQuestionTick] = useState(0);
  const [finished, setFinished] = useState(false);

  const targetSpecies = useMemo(() => {
    return pool[Math.floor(Math.random() * pool.length)];
  }, [pool, questionTick]);

  const options = useMemo(() => {
    const others = pool.filter((s) => s.id !== targetSpecies.id);
    const distractors = shuffleArray(others).slice(0, 3);
    return shuffleArray([targetSpecies, ...distractors]);
  }, [targetSpecies, pool]);

  useEffect(() => {
    if (finished) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      onUpdateRecord(score);
      if (score >= 10) {
        onEarnHints(Math.floor(score / 5));
      }
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, finished, score, onUpdateRecord, onEarnHints]);

  const handleAnswer = (chosen: CactusSpecies) => {
    if (finished) return;
    if (chosen.id === targetSpecies.id) {
      const nextScore = score + 1;
      setScore(nextScore);
      onUpdateRecord(nextScore);
    } else {
      // 2 second penalty on wrong answer in 1-minute blitz
      setSecondsLeft((prev) => Math.max(0, prev - 2));
    }
    setQuestionTick((prev) => prev + 1);
  };

  const handleRestart = () => {
    setSecondsLeft(60);
    setScore(0);
    setQuestionTick((prev) => prev + 1);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">¡Tiempo agotado!</h2>
          <p className="text-sm text-stone-600 mb-6">
            Puntuación en 1 minuto:{' '}
            <span className="text-xl font-bold text-emerald-700 tabular-nums">{score}</span> respuestas correctas
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium"
            >
              Menú del nivel
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Intentar de nuevo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-xl font-bold text-stone-900 tabular-nums">Puntos: {score}</div>

        <div
          className={`flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums px-2.5 py-1 rounded-md ${
            secondsLeft <= 10 ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-800'
          }`}
        >
          <Timer className="w-5 h-5" />
          <span>0:{String(secondsLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Time bar */}
      <div className="px-3 mb-2">
        <div className="w-full h-1.5 bg-stone-300 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              secondsLeft <= 10 ? 'bg-red-600' : 'bg-green-600'
            }`}
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {subMode === 'words' ? (
        <div className="flex-1 flex flex-col justify-between px-3 pb-4 gap-3">
          <div className="bg-stone-300 p-2 rounded-sm">
            <CactusPhotoFrame
              species={targetSpecies}
              photoData={photosMap[targetSpecies.id]?.photoData}
              isOwner={isOwner}
              onEditClick={(sp) => onOpenEditor(sp)}
              hideNameOverlay={true}
              className="w-full h-64 sm:h-72 bg-stone-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5 mt-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="w-full py-3.5 px-4 rounded-md bg-white border border-stone-300 text-stone-900 font-medium italic text-lg hover:bg-stone-50 active:bg-stone-200 shadow-xs"
              >
                {opt.scientificName}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between px-3 pb-4">
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-normal text-stone-900 italic">
              {targetSpecies.scientificName}
            </h2>
            <p className="text-xs text-stone-500 mt-1">{targetSpecies.origin}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                className="p-2 bg-stone-300 hover:bg-stone-400/70 rounded-xs cursor-pointer"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
