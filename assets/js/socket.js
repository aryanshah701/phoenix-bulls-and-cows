// All functions below were inspired by Nat Tuck scratch 02/09, socket.js

import { Socket } from "phoenix";
let socket = new Socket("/socket", { params: { token: "" } });

socket.connect();

// Creating game:1 channel by default
let channel = socket.channel("game:1", {});

// Initialising state and set state callback
let gameState = {
  results: [],
  guesses: [],
  won: false,
};

let callback = null;

// Function to update the game state(from the server)
function updateGame(newGame) {
  console.log("---------------");
  console.log("New game results: " + newGame.results);
  console.log("New game guesses: " + newGame.guesses);
  console.log("Won:" + newGame.won);
  console.log("---------------");
  gameState = newGame;

  if (callback) {
    callback(gameState);
  }
}

// Function to call when intially starting game
export function channelJoin(setState) {
  callback = setState;
  callback(gameState);
}

// Function to make a guess
export function channelMakeGuess(guess) {
  channel
    .push("guess", guess)
    .receive("ok", updateGame)
    .receive("error", (resp) => {
      console.log("Unable to push", resp);
    });
}

// Function to reset the game state
export function channelResetGame() {
  channel
    .push("reset", {})
    .receive("ok", updateGame)
    .receive("error", (resp) => {
      console.log("Unable to reset game", resp);
    });
}

// Join the channel, and upadate state if join is successful
channel
  .join()
  .receive("ok", (resp) => updateGame)
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

//export default socket;
