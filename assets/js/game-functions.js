import { shuffle, difference } from "lodash";

// Are there any characters in the string
function anyCharacterInString(str) {
  let chars = str.split("");
  return chars.filter((ch) => ch === "0" || Boolean(parseInt(ch))).length !== 4;
}

// Are there any duplicate characters in the string
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

// Is the given guess valid
export function isValidGuess(guess) {
  return !anyCharacterInString(guess) && !anyDuplicateCharactersInString(guess);
}

//Checks if the current user is an observer
export function isObserver(userName, observers) {
  return observers.includes(userName);
}

// What type is the given user, player or observer
export function getUserType(userName, observers) {
  return isObserver(userName, observers) ? "Observer" : "Player";
}
