import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lightbulb, RotateCcw } from 'lucide-react';
import { CactusSpecies } from '../data/cactusSpecies';
import { CustomPhotoRecord } from '../types/quiz';
import { CactusPhotoFrame } from './CactusPhotoFrame';

interface SpellingModeProps {
  difficulty: 'easy' | 'hard';
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

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface TileItem {
  id: number;
  char: string;
  used: boolean;
}

export const SpellingMode: React.FC<SpellingModeProps> = ({
  difficulty,
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
  const questionsOrder = useMemo(() => shuffleArray(pool), [pool]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentSpecies = questionsOrder[currentIndex % questionsOrder.length];

  // Clean word characters (keep spaces and hyphens pre-filled, user types letters)
  const targetAnswer = useMemo(() => {
    return currentSpecies.scientificName.toUpperCase();
  }, [currentSpecies]);

  // Positions that need user letters (A-Z)
  const letterIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = 0; i < targetAnswer.length; i++) {
      if (/[A-Z]/.test(targetAnswer[i])) {
        indices.push(i);
      }
    }
    return indices;
  }, [targetAnswer]);

  const [filledSlots, setFilledSlots] = useState<Record<number, { char: string; tileId: number }>>({});
  const [tiles, setTiles] = useState<TileItem[]>([]);

  useEffect(() => {
    setFilledSlots({});
    setMistakeCount(0);

    const neededChars: string[] = [];
    for (const idx of letterIndices) {
      neededChars.push(targetAnswer[idx]);
    }

    // Total tiles multiple of 7 (14 or 21 or 28 depending on word length)
    const minSlots = Math.max(14, Math.ceil(neededChars.length / 7) * 7);
    const extraCount = difficulty === 'hard' ? Math.max(4, minSlots - neededChars.length) : minSlots - neededChars.length;
    const totalCount = Math.ceil((neededChars.length + extraCount) / 7) * 7;

    const allChars = [...neededChars];
    while (allChars.length < totalCount) {
      const randChar = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      allChars.push(randChar);
    }

    const shuffled = shuffleArray(allChars).map((char, i) => ({
      id: i,
      char,
      used: false,
    }));
    setTiles(shuffled);
  }, [currentSpecies, targetAnswer, letterIndices, difficulty]);

  // Next active letter slot index in targetAnswer
  const nextTargetPos = useMemo(() => {
    for (const pos of letterIndices) {
      if (!filledSlots[pos]) return pos;
    }
    return null;
  }, [letterIndices, filledSlots]);

  const handleTileClick = (tile: TileItem) => {
    if (tile.used || nextTargetPos === null) return;

    const expectedChar = targetAnswer[nextTargetPos];

    if (difficulty === 'easy') {
      // In easy mode, immediately check if the letter matches the next slot
      if (tile.char === expectedChar) {
        const nextFilled = {
          ...filledSlots,
          [nextTargetPos]: { char: tile.char, tileId: tile.id },
        };
        setFilledSlots(nextFilled);
        setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)));

        if (Object.keys(nextFilled).length === letterIndices.length) {
          handleWordSolved();
        }
      } else {
        setMistakeCount((prev) => prev + 1);
      }
    } else {
      // In hard mode, let user place any letter into the slot; check when full
      const nextFilled = {
        ...filledSlots,
        [nextTargetPos]: { char: tile.char, tileId: tile.id },
      };
      setFilledSlots(nextFilled);
      setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)));

      if (Object.keys(nextFilled).length === letterIndices.length) {
        const allCorrect = letterIndices.every((pos) => nextFilled[pos]?.char === targetAnswer[pos]);
        if (allCorrect) {
          handleWordSolved();
        } else {
          setMistakeCount((prev) => prev + 1);
        }
      }
    }
  };

  const handleSlotClick = (pos: number) => {
    const entry = filledSlots[pos];
    if (!entry || entry.tileId === -1) return; // -1 = locked by hint
    const nextFilled = { ...filledSlots };
    delete nextFilled[pos];
    setFilledSlots(nextFilled);
    setTiles((prev) => prev.map((t) => (t.id === entry.tileId ? { ...t, used: false } : t)));
  };

  const handleWordSolved = () => {
    const nextScore = score + 1;
    setScore(nextScore);
    onUpdateScore(nextScore);
    const earnedBulbs = Math.max(1, 4 - mistakeCount);
    onEarnHints(earnedBulbs);

    setTimeout(() => {
      if (currentIndex + 1 >= questionsOrder.length) {
        setCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 380);
  };

  const handleRevealFullWord = () => {
    if (nextTargetPos === null) return;
    if (!onSpendHints(10)) return;

    const full: Record<number, { char: string; tileId: number }> = {};
    for (const pos of letterIndices) {
      full[pos] = { char: targetAnswer[pos], tileId: -1 };
    }
    setFilledSlots(full);
    handleWordSolved();
  };

  const handleRevealOneLetter = () => {
    if (nextTargetPos === null) return;
    if (!onSpendHints(2)) return;

    const expectedChar = targetAnswer[nextTargetPos];
    const matchingTile = tiles.find((t) => !t.used && t.char === expectedChar);

    const nextFilled = {
      ...filledSlots,
      [nextTargetPos]: { char: expectedChar, tileId: matchingTile ? matchingTile.id : -1 },
    };
    setFilledSlots(nextFilled);
    if (matchingTile) {
      setTiles((prev) => prev.map((t) => (t.id === matchingTile.id ? { ...t, used: true } : t)));
    }

    if (Object.keys(nextFilled).length === letterIndices.length) {
      handleWordSolved();
    }
  };

  const progressPercent = Math.min(100, (score / pool.length) * 100);
  const remainingBulbsForWord = Math.max(0, 4 - mistakeCount);

  if (completed) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">¡Prueba completada!</h2>
          <p className="text-sm text-stone-600 mb-6">
            Has escrito correctamente <span className="font-bold tabular-nums">{score}</span> nombres científicos.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium"
            >
              Menú del nivel
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setCompleted(false);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Split targetAnswer into Genus and Species words for clean row display
  const words = targetAnswer.split(' ');

  return (
    <div className="max-w-xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] bg-stone-100">
      {/* Top Bar matching screenshot 2 */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleRevealOneLetter}
            title="Revelar 1 letra (2 bombillas)"
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-amber-100/70 transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-lg font-medium text-stone-800 tabular-nums">{hints}</span>
          </button>
        </div>

        <div className="text-xl font-medium text-stone-900 tabular-nums">{score + 1}</div>

        {/* 4 small bulb outlines on right like screenshot 2 */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((idx) => (
            <Lightbulb
              key={idx}
              className={`w-5 h-5 ${
                idx <= remainingBulbsForWord
                  ? 'text-amber-500 fill-amber-100'
                  : 'text-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Line */}
      <div className="px-3 mb-2">
        <div className="w-full h-1.5 bg-stone-400/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Image Frame with floating "Mostrar 10 💡" button */}
      <div className="px-3 relative">
        <button
          type="button"
          onClick={handleRevealFullWord}
          className="absolute -top-1 right-5 z-20 px-4 py-1.5 rounded-full bg-gradient-to-b from-white to-stone-200 border-2 border-stone-500 shadow-md hover:from-stone-50 hover:to-stone-300 active:scale-95 transition-all flex flex-col items-center leading-tight"
        >
          <span className="text-xs font-semibold text-stone-900">Mostrar</span>
          <span className="text-xs font-bold text-stone-900 flex items-center gap-0.5 tabular-nums">
            10 <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400 inline" />
          </span>
        </button>

        <CactusPhotoFrame
          species={currentSpecies}
          photoData={photosMap[currentSpecies.id]?.photoData}
          isOwner={isOwner}
          onEditClick={(sp) => onOpenEditor(sp)}
          hideNameOverlay={true}
          className="w-full h-60 sm:h-68 rounded-xs"
        />
        <div className="text-center mt-1 text-xs text-stone-500">
          Género: <span className="font-semibold text-stone-700">{currentSpecies.genus[0]}...</span> · Tribu:{' '}
          {currentSpecies.tribe} · {currentSpecies.origin}
        </div>
      </div>

      {/* Dark Grey Answer Letter Boxes (like screenshot 2) */}
      <div className="px-2 py-4 flex flex-col items-center justify-center gap-2 my-auto">
        {(() => {
          let charGlobalCursor = 0;
          return words.map((word, wIdx) => {
            const wordStartPos = charGlobalCursor;
            charGlobalCursor += word.length + 1; // +1 for space
            return (
              <div key={wIdx} className="flex flex-wrap items-center justify-center gap-1">
                {word.split('').map((ch, cIdx) => {
                  const absPos = wordStartPos + cIdx;
                  const isFixedSymbol = !/[A-Z]/.test(ch);
                  const filled = filledSlots[absPos];
                  return (
                    <button
                      key={absPos}
                      type="button"
                      disabled={isFixedSymbol || !filled}
                      onClick={() => handleSlotClick(absPos)}
                      className={`w-8 h-10 sm:w-9 sm:h-11 rounded-md flex items-center justify-center font-bold text-lg sm:text-xl shadow-inner border transition-transform ${
                        isFixedSymbol
                          ? 'bg-transparent border-transparent text-stone-700 w-4'
                          : filled
                          ? 'bg-stone-600 border-stone-700 text-amber-400 active:scale-95'
                          : 'bg-stone-600 border-stone-700 text-transparent'
                      }`}
                    >
                      {isFixedSymbol ? ch : filled?.char || ''}
                    </button>
                  );
                })}
              </div>
            );
          });
        })()}
      </div>

      {/* 7-column Light Grey Keyboard Tiles (like screenshot 2) */}
      <div className="px-2.5 pb-5 mt-auto">
        <div className="grid grid-cols-7 gap-1.5">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              disabled={tile.used}
              onClick={() => handleTileClick(tile)}
              className={`h-12 sm:h-13 rounded-md font-semibold text-lg sm:text-xl border shadow-xs transition-all flex items-center justify-center ${
                tile.used
                  ? 'bg-stone-300/70 border-stone-400/50 text-transparent cursor-default'
                  : 'bg-stone-300 border-stone-400 text-stone-950 hover:bg-stone-200 active:scale-95'
              }`}
            >
              {tile.used ? '' : tile.char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
