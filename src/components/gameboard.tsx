import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from './Keyboard';
import { wordService } from '../services/wordService';

const NUM_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const today = new Date().toISOString().slice(0, 10);
const gameKey = `ordle-game-${today}`;

type GuessFeedback = 'green' | 'yellow' | 'grey' | null;

type GameState = {
  guesses: string[][];
  currentRow: number;
  feedbackRows: GuessFeedback[][];
  revealedRows: boolean[][];
  gameResult: string;
};

type BounceTile = {
  row: number;
  col: number;
} | null;

interface GameBoardProps {
  onGameOver?: () => void;
}

// Sync guess feedback to the keyboard
function getKeyBoardFeedback(
  guesses: string[][],
  feedbackRows: GuessFeedback[][]
): Record<string, GuessFeedback> {
  const feedback: Record<string, GuessFeedback> = {};
  guesses.forEach((guess, rowIdx) => {
    guess.forEach((char, colIdx) => {
      const fb = feedbackRows[rowIdx]?.[colIdx];
      if (!char || !fb) return;
      // Prioritize green > yellow > grey
      if (
        fb === 'green' ||
        (fb === 'yellow' && feedback[char] !== 'green') ||
        (fb === 'grey' && !feedback[char])
      ) {
        feedback[char] = fb;
      }
    });
  });
  return feedback;
}

function getInitialState(): GameState {
  const existingGame = localStorage.getItem(gameKey);
  if (existingGame) {
    return JSON.parse(existingGame);
  }
  const state = {
    guesses: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill('')),
    currentRow: 0,
    feedbackRows: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill(null)),
    revealedRows: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill(false)),
    gameResult: '',
    solution: null,
  };
  localStorage.setItem(gameKey, JSON.stringify(state));
  return state;
}

export default function GameBoard({ onGameOver }: GameBoardProps) {
  const { t } = useTranslation();

  // State
  const [guesses, setGuesses] = useState<string[][]>(
    () => getInitialState().guesses
  );
  const [currentRow, setCurrentRow] = useState(
    () => getInitialState().currentRow
  );
  const [feedbackRows, setFeedbackRows] = useState<GuessFeedback[][]>(
    () => getInitialState().feedbackRows
  );
  const [revealedRows, setRevealedRows] = useState<boolean[][]>(
    () => getInitialState().revealedRows
  );
  const [result, setResult] = useState<string>(
    () => getInitialState().gameResult || ''
  );
  const [invalidWord, setInvalidWord] = useState<string>('');
  const [shakeRow, setShakeRow] = useState(false);
  const [bounceTile, setBounceTile] = useState<BounceTile>(null);

  // Notification ref
  const notificationMessage = useRef<HTMLDivElement | null>(null);

  // Check guess data
  const guessWord = (guesses[currentRow] ?? []).join('');

  // Save game state to localStorage
  useEffect(() => {
    const updatedState: GameState = {
      guesses,
      currentRow,
      feedbackRows,
      revealedRows,
      gameResult: result,
    };
    localStorage.setItem(gameKey, JSON.stringify(updatedState));
  }, [guesses, currentRow, feedbackRows, revealedRows, result]);

  // Notification animation
  useEffect(() => {
    if (notificationMessage.current && (result || invalidWord)) {
      notificationMessage.current.style.opacity = '1';
      notificationMessage.current.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (notificationMessage.current) {
          notificationMessage.current.style.opacity = '0';
          notificationMessage.current.style.transform = 'translateY(-100%)';
        }
      }, 1500);
    }
  }, [result, invalidWord]);

  // Global key handler
  useEffect(() => {
    if (result) return; // Don't listen if game is over

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      // Allow only valid characters (A-Z, ÆØÅ)
      if (/^[A-ZÆØÅ]$/.test(key)) {
        const nextIdx = guesses[currentRow]?.findIndex((c) => c === '');
        if (nextIdx !== undefined && nextIdx !== -1) {
          const newGuesses = guesses.map((row, r) =>
            row.map((char, c) =>
              r === currentRow && c === nextIdx ? key : char
            )
          );
          setGuesses(newGuesses);
          setBounceTile({ row: currentRow, col: nextIdx });
          setTimeout(() => setBounceTile(null), 300);
        }
      } else if (e.key === 'Backspace') {
        // Remove last filled cell in current row
        const row = guesses[currentRow] ?? [];
        const lastFilled = [...row].reverse().findIndex((c) => c !== '');
        if (lastFilled !== -1) {
          const idx = WORD_LENGTH - 1 - lastFilled;
          const newGuesses = guesses.map((rowArr, r) =>
            rowArr.map((char, c) => (r === currentRow && c === idx ? '' : char))
          );
          setGuesses(newGuesses);
        }
      } else if (e.key === 'Enter') {
        // Submit guess if row is filled
        if ((guesses[currentRow] ?? []).every((c) => c !== '')) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses, currentRow, result]);

  // Submit guess
  const handleSubmit = async () => {
    if (!(guesses[currentRow] ?? []).every((c) => c !== '') || result) return;
    setInvalidWord('');
    try {
      // const result = await refetch();
      const checkGuess = wordService.checkGuess(guessWord);
      if (!checkGuess.wordExists) {
        setInvalidWord(t('GameBoard.invalidWord.notFound'));
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 600);
        return;
      }

      setFeedbackRows((prev) => {
        const next = [...prev];
        next[currentRow] = checkGuess.feedback ?? Array(WORD_LENGTH).fill(null);
        return next;
      });
      // Reveal animation
      if (checkGuess.feedback) {
        checkGuess.feedback.forEach((_, i) => {
          setTimeout(
            () => {
              setRevealedRows((prev) => {
                const next = prev.map((row) => [...row]);
                if (next[currentRow]) next[currentRow][i] = true;
                return next;
              });
            },
            i * 100 + 300
          );
        });
      }

      if (checkGuess.correct) {
        console.log('Correct!', checkGuess);
        setResult(t('GameBoard.result.victory'));
      } else if (currentRow < NUM_ATTEMPTS - 1) {
        setCurrentRow(currentRow + 1);
      } else {
        setResult(t('GameBoard.result.defeat'));
      }
    } catch {
      setInvalidWord(t('GameBoard.invalidWord.error'));
    }
  };

  // Notify when game is over, after delay
  useEffect(() => {
    if (result && onGameOver) {
      const timer = setTimeout(() => {
        onGameOver();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result, onGameOver, guesses]);

  // Render board
  return (
    <>
      <div className="relative mt-8 rounded bg-white/10 p-8 text-white">
        {/* Floating notification above the board */}
        <div
          className="pointer-events-none absolute z-10 mb-4 flex w-full justify-center transition-all duration-500 ease-in-out"
          ref={notificationMessage}
          style={{
            opacity: 0,
            bottom: '100%',
            left: 0,
            transform: 'translateY(-16px)', // gap above board
          }}
        >
          <div
            className={`rounded bg-white/80 px-6 py-3 text-center text-2xl font-bold ${invalidWord ? 'text-red-400' : 'text-black'} shadow-lg`}
          >
            {result || invalidWord}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {guesses.map((guess, rowIdx) => {
            const showFeedback = rowIdx < currentRow || !!result;
            const feedback = showFeedback
              ? (feedbackRows[rowIdx] ?? Array(WORD_LENGTH).fill(null))
              : Array(WORD_LENGTH).fill(null);
            const shake = rowIdx === currentRow && shakeRow;
            return (
              <div
                key={rowIdx}
                className={`flex justify-center gap-2 ${shake ? 'shake' : ''}`}
              >
                {guess.map((char, letterIdx) => {
                  // Flip animation with cascade
                  const flip = showFeedback && feedback[letterIdx] != null;
                  const delay = flip ? `${letterIdx * 100}ms` : undefined;
                  let bg = 'bg-white/20';
                  if (flip && revealedRows[rowIdx]?.[letterIdx]) {
                    if (feedback[letterIdx] === 'green') bg = 'bg-green-600';
                    else if (feedback[letterIdx] === 'yellow')
                      bg = 'bg-yellow-400';
                    else if (feedback[letterIdx] === 'grey') bg = 'bg-gray-600';
                  }
                  return (
                    <span
                      key={letterIdx}
                      className={`flex h-12 w-12 items-center justify-center rounded border border-white/30 text-center text-2xl font-bold select-none ${bg} ${flip ? 'flip' : ''} ${bounceTile?.row === rowIdx && bounceTile?.col === letterIdx ? 'bounce' : ''}`}
                      style={flip ? { animationDelay: delay } : undefined}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Keyboard keyFeedback={getKeyBoardFeedback(guesses, feedbackRows)} />
    </>
  );
}
