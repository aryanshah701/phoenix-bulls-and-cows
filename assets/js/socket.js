// All functions below were inspired by Nat Tuck scratch 02/09, socket.js

import { Socket } from "phoenix";
let socket = new Socket("/socket", { params: { token: "" } });

socket.connect();

// Creating channel with name of the game
// let channel = socket.channel("game:1", {});
let channel = null;

// Initialising state and set state callback
let gameState = {
  results: [],
  guesses: [],
  won: false,
  gameStarted: false,
  gameJoined: true,
  gameName: "",
  userName: "",
};

let callback = null;

// Function to update the game state(from the server)
function updateGame(newGame) {
  console.log("---------------");
  console.log("New game results: " + newGame.results);
  console.log("New game guesses: " + newGame.guesses);
  console.log("Won:" + newGame.won);
  console.log("---------------");
  gameState = {
    ...gameState,
    results: newGame.results,
    guesses: newGame.guesses,
    won: newGame.won,
  };
  console.log("Channel username: " + gameState.userName);
  if (callback) {
    callback(gameState);
  }
}

// Function to call when intially starting game
export function channelJoin(setState, gameName) {
  console.log("Joining channel game:" + gameName);
  callback = setState;

  // Create new channel with game name
  channel = socket.channel("game:" + gameName, {});

  // Join the channel, and upadate state if join is successful
  channel
    .join()
    .receive("ok", (resp) => updateGame(resp))
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  // Listen view view update broadcasts(Taken from Nat Tuck notes, 0219 socket.js)
  channel.on("view", (view_game) => {
    console.log("Broadcast received");
    updateGame(view_game);
  });

  // Update state with gameName and joined = true
  gameState = {
    ...gameState,
    gameName: gameName,
    gameJoined: true,
  };

  callback(gameState);
}

// Function to login to a game
export function channelLogin(username) {
  console.log("Logging in user " + username);
  // Update state with userName
  gameState = {
    ...gameState,
    userName: username,
  };

  channel
    .push("login", { name: username })
    .receive("ok", updateGame)
    .receive("error", (resp) => {
      console.log("Unable to login", resp);
    });
}

// Updates the game state to start the game
export function channelStartGame() {
  gameState = {
    ...gameState,
    gameStarted: true,
  };

  if (callback) {
    callback(gameState);
  }
}

// Leaves the game by resetting game state
export function channelLeaveGame() {
  gameState = {
    results: [],
    guesses: [],
    won: false,
    gameStarted: false,
    gameJoined: false,
    gameName: "",
    userName: "",
  };

  if (callback) {
    callback(gameState);
  }
}

// Function to make a guess
export function channelMakeGuess(guess) {
  console.log(guess);
  channel
    .push("guess", guess)
    .receive("ok", updateGame)
    .receive("error", (resp) => {
      console.log("Unable to guess", resp);
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
