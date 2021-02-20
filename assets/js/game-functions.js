import { shuffle, difference } from 'lodash';

//Compute a randomised 
export function computeRandomSecret() {
  let secret = "";
  //Array of digits
  let nums = [0, 1, 2, 3, 4, 5, 6 , 7, 8, 9];
  let shuffledNums = shuffle(nums);

  for (let i = 0; i < 4; i++) {
    secret += shuffledNums[i];
  }

  return secret;
}

function anyCharacterInString(str) {
  let chars = str.split("");
  return chars.filter((ch) => ch === '0' || Boolean(parseInt(ch))).length !== 4;
}

function anyDuplicateCharactersInString(str) {
  let chars = str.split("");
  for (let i = 0; i < chars.length; i++) {
    for (let j = i + 1; j < chars.length; j++) {
      if (chars[i] === chars[j]) {
        return true;
      }
    }
  }

  return false;
}

export function isValidGuess(guess) {
  return !anyCharacterInString(guess) && !anyDuplicateCharactersInString(guess);
}

export function computeResult(secret, guess) {
  if (!secret || !guess) {
    return "";
  }

  let secretChars = secret.split("");
  let guessChars = guess.split("");

  //Searching for Bulls
  let bulls = [];
  for (let i = 0; i < secretChars.length; i++) {
    if (secretChars[i] === guessChars[i]) {
      bulls.push(secretChars[i]);
    }
  }

  //Searching for Cows
  let cows = [];
  for (let i = 0; i < guessChars.length; i++) {
    for (let j = 0; j < secretChars.length; j++) {
      if (guessChars[i] === secretChars[j]) {
        cows.push(guessChars[i]);
      }
    }
  }

  cows = difference(cows, bulls);

  //Returning formatted string
  let opString = parseInt(cows.length) + "C" + parseInt(bulls.length) + "B";
  console.log("Cows: " + cows);
  console.log("Bulls: " + bulls);
  return opString;
}

export function hasWon(state) {
  let secret = state.secret;
  let guesses = state.guesses;
  let lastGuess = guesses[guesses.length - 1];
  return secret === lastGuess;
}