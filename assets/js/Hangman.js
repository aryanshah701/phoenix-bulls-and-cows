import React from "react";
import { useState, useEffect } from "react";
import { isValidGuess, getUserType, isObserver } from "./game-functions";
import {
  channelJoin,
  channelLogin,
  channelAddPlayer,
  channelUpdatePlayerStatus,
  channelAddObserver,
  channelMakeGuess,
  channelResetGame,
  channelStartGame,
  channelLeaveGame,
} from "./socket";

import EnterGameScreen from "./EnterGameScreen";
import Input from "./Input";
import GuessTable from "./GuessTable";
import Lobby from "./Lobby";
import GameOver from "./GameOver";

import "milligram";
import "../css/app.scss";

// Component to render the rules section of the game
function Rules() {
  return (
    <div className="container rules">
      <h4>Rules and Gampeplay</h4>
      <ul>
        <li>Only numbers can be entered into the input box.</li>
        <li>No duplicate numbers can be entered into the input box.</li>
        <li>
          Each guess has a result indicating the number of cows and bulls in the
          guess.
          <ul>
            <li>
              A cow is a number present in the secret but in the wrong position.
            </li>
            <li>
              A bull is a number present in the secret and in the right
              position.
            </li>
          </ul>
        </li>
        <li>If the secret number isn't guessed in 8 trials, you loose.</li>
        <li>
          Press the reset button to reset the game(note the secret will also
          reset).
        </li>
      </ul>
    </div>
  );
}

// The Parent component
function App() {
  let [state, setState] = useState({
    guesses: [],
    results: [],
    won: false,
    gameStarted: false,
    gameJoined: false,
    gameName: "",
    userName: "",
    players: [],
    observers: [],
  });

  const gameStarted = state.gameStarted;
  const gameJoined = state.gameJoined;

  // Join channel when game name changes
  useEffect(() => {
    if (gameJoined) {
      channelJoin(setState, state.gameName);
    }
  }, [state.gameName]);

  // Login user when user name changes
  useEffect(() => {
    if (state.userName != "") {
      channelLogin(state.userName);
    }
  }, [state.userName]);

  // Function to join a game
  function setGameJoined(gameName, userName) {
    console.log("Joining game " + gameName);

    setState({
      ...state,
      gameJoined: true,
      gameName: gameName,
      userName: userName,
    });
  }

  // Function to leave a game
  function leaveGame() {
    console.log("Leaving game...");
    channelLeaveGame();
  }

  // Function to start a game
  function setGameStarted(updatedGameStarted) {
    console.log("Starting game...");
    channelStartGame();
  }

  //Function to handle making a guess
  function makeGuess(guess) {
    //Validating guess
    if (!isValidGuess(guess)) {
      return;
    }

    //Make the guess
    channelMakeGuess({ guess: guess });
  }

  //Function to handle resetting
  function reset() {
    //Reset the game
    channelResetGame();
  }

  //EnterGameScreen if game hasn't started yet
  if (!gameJoined) {
    return <EnterGameScreen setGameJoined={setGameJoined} />;
  }

  //LobbyGameScreen if game has been joined but not yet started
  if (state.gameJoined && !state.gameStarted) {
    return (
      <Lobby
        gameName={state.gameName}
        userName={state.userName}
        observers={state.observers}
        players={state.players}
        setGameStarted={setGameStarted}
        makePlayer={channelAddPlayer}
        makeObserver={channelAddObserver}
        updateStatus={channelUpdatePlayerStatus}
      />
    );
  }

  //Game Won
  if (state.won) {
    return (
      <div>
        <GameOver reset={reset} won={true} />
      </div>
    );
  }

  //Game Over
  if (state.guesses.length > 7) {
    return (
      <div>
        <GameOver reset={reset} won={false} />
      </div>
    );
  }

  return (
    <div>
      <h1>Bulls and Cows</h1>
      <div className="container">
        <div className="row">
          <div className="column">
            <h2>Game: {state.gameName}</h2>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <h2>User: {state.userName}</h2>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <h2>Type: {getUserType(state.userName, state.observers)}</h2>
          </div>
        </div>
        <div className="row">
          <div className="column column-30">
            <Rules />
          </div>
          <div className="column column-70">
            <Input
              makeGuess={makeGuess}
              reset={reset}
              setState={setState}
              leaveGame={leaveGame}
              isObserver={() => isObserver(state.userName, state.observers)}
            />
            <GuessTable results={state.results} guesses={state.guesses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
