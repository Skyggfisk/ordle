import { words } from '../words';

export type GuessFeedback = 'green' | 'yellow' | 'grey';
export type CheckGuessResult = {
  feedback?: GuessFeedback[];
  correct: boolean;
  wordExists: boolean;
  solution: string | undefined;
};

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
      solution,
    };
  }
  const feedback: GuessFeedback[] = Array(solution.length).fill('grey');
  const solutionArr = solution.split('');
  const guessArr = guess.toUpperCase().split('');
  // First pass: greens
  solutionArr.forEach((char, idx) => {
    if (guessArr[idx] === char) {
      feedback[idx] = 'green';
      solutionArr[idx] = '';
      guessArr[idx] = '';
    }
  });
  // Second pass: yellows
  guessArr.forEach((char, idx) => {
    if (char && solutionArr.includes(char)) {
      feedback[idx] = 'yellow';
      solutionArr[solutionArr.indexOf(char)] = '';
    }
  });
  const correct = feedback.every((f) => f === 'green');
  return {
    feedback,
    correct,
    wordExists: true,
    solution,
  };
}

export const wordService = {
  getWotd,
  checkGuess,
};
