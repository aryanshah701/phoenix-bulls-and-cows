import React from "react";
import { useState, useEffect } from "react";
import { isValidGuess } from "./game-functions";
import { channelJoin, channelMakeGuess, channelResetGame } from "./socket";

import EnterGameScreen from "./EnterGameScreen";
import Input from "./Input";

import "milligram";
import "../css/app.scss";

function Header() {
  return (
    <div className="container">
      <div className="row">
        <div className="column column-10 center">#</div>
        <div className="column column-45 center">Guess</div>
        <div className="column column-45 center">Result</div>
      </div>
    </div>
  );
}

function Guess(props) {
  let { idx, guess, result } = props;

  return (
    <div className="container">
      <div className="row">
        <div className="column column-10 center">{idx}</div>
        <div className="column column-45 center">{guess}</div>
        <div className="column column-45 center">{result}</div>
      </div>
    </div>
  );
}

function GuessTable(props) {
  let { results, guesses } = props;

  return (
    <div className="container">
      <Header />
      <div className="row">
        <div className="column">
          <Guess idx={1} guess={guesses[0]} result={results[0]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={2} guess={guesses[1]} result={results[1]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={3} guess={guesses[2]} result={results[2]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={4} guess={guesses[3]} result={results[3]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={5} guess={guesses[4]} result={results[4]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={6} guess={guesses[5]} result={results[5]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={7} guess={guesses[6]} result={results[6]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess idx={8} guess={guesses[7]} result={results[7]} />
        </div>
      </div>
    </div>
  );
}

function GameOver(props) {
  let { reset } = props;
  let { won } = props;
  let message = "";

  if (won) {
    message = "You Won!";
  } else {
    message = "Sorry, you lost!";
  }

  return (
    <div>
      <h1>Bulls and Cows</h1>
      <h4>{message}</h4>
      <button id="new-game" onClick={() => reset()}>
        New Game
      </button>
    </div>
  );
}

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

function App() {
  let [state, setState] = useState({
    guesses: [],
    results: [],
    won: false,
    gameStarted: false,
    gameName: "",
  });

  const gameStarted = state.gameStarted;

  function setGameStarted(updatedGameStarted, gameName) {
    setState({
      ...state,
      gameStarted: updatedGameStarted,
      gameName: gameName,
    });
  }

  useEffect(() => {
    if (gameStarted) {
      channelJoin(setState, state.gameName);
    }
  }, [state.gameStarted]);

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

  //Function to handle resetting the game visually
  function visualReset() {
    setState({
      ...state,
    });
  }

  //EnterGameScreen if game hasn't started yet
  if (!gameStarted) {
    return (
      <EnterGameScreen
        setGameStarted={setGameStarted}
        visualReset={visualReset}
        setState={setState}
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
          <div className="column column-30">
            <Rules />
          </div>
          <div className="column column-70">
            <Input makeGuess={makeGuess} reset={reset} setState={setState} setGameStarted={setGameStarted} />
            <GuessTable results={state.results} guesses={state.guesses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
