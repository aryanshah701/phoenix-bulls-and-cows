import React from "react";
import { useState } from "react";

import "milligram";
import "../css/app.scss";

function Input(props) {
  const [inputString, setInputString] = useState("");
  let { makeGuess, reset, setGameStarted, visualReset } = props;

  // Update input field
  function updateText(ev) {
    let currInput = ev.target.value;

    //Not allowing inputs of greater than 4
    if (currInput.length > 4) {
      return;
    }

    setInputString(currInput);
  }

  // Leave game
  function leaveGame() {
    // Set game started to false
    setGameStarted(false);
  }

  return (
    <div className="container container-large">
      <div className="row">
        <div className="column column-20">
          <p>Input Guess: </p>
        </div>
        <div className="column column-35">
          {/* Input test field logic inspired by hangman class notes */}
          <input
            type="text"
            value={inputString}
            onChange={updateText}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                makeGuess(inputString);
                setInputString("");
              }
            }}
          ></input>
        </div>
        <div className="column column-15">
          <button
            onClick={() => {
              makeGuess(inputString);
              setInputString("");
            }}
          >
            Guess
          </button>
        </div>
        <div className="column column-15">
          <button
            onClick={() => {
              reset();
              setInputString("");
            }}
          >
            Reset
          </button>
        </div>
        <div className="column column-10">
          <button onClick={() => leaveGame()}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

export default Input;