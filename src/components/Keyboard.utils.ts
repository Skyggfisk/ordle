import { FEEDBACK, type GuessFeedback } from '../types/game';

// Utility to sync guess feedback to the keyboard
export function getKeyboardFeedback(
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
        fb === FEEDBACK.GREEN ||
        (fb === FEEDBACK.YELLOW && feedback[char] !== FEEDBACK.GREEN) ||
        (fb === FEEDBACK.GREY && !feedback[char])
      ) {
        feedback[char] = fb;
      }
    });
  });
  return feedback;
}
