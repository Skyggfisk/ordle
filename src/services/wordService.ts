import type { CheckGuessResult, GuessFeedback } from '~/types/game';
import { FEEDBACK } from '~/types/game';
import { words } from '~/words';

const msPerDay = 1000 * 60 * 60 * 24;

function getWotd(): string {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / msPerDay);
  return words[daysSinceEpoch % words.length];
}

function checkGuess(guess: string): CheckGuessResult {
  const solution = getWotd();
  const wordExists = words.includes(guess.toUpperCase());
  if (!wordExists) {
    return {
      correct: false,
      wordExists: false,
    };
  }
  const feedback: GuessFeedback[] = Array(solution.length).fill(FEEDBACK.GREY);
  const solutionArr = solution.split('');
  const guessArr = guess.toUpperCase().split('');
  // First pass: greens
  solutionArr.forEach((char, idx) => {
    if (guessArr[idx] === char) {
      feedback[idx] = FEEDBACK.GREEN;
      solutionArr[idx] = '';
      guessArr[idx] = '';
    }
  });
  // Second pass: yellows
  guessArr.forEach((char, idx) => {
    if (char && solutionArr.includes(char)) {
      feedback[idx] = FEEDBACK.YELLOW;
      solutionArr[solutionArr.indexOf(char)] = '';
    }
  });
  const correct = feedback.every((f) => f === FEEDBACK.GREEN);
  return {
    feedback,
    correct,
    wordExists: true,
  };
}

export const wordService = {
  getWotd,
  checkGuess,
};
