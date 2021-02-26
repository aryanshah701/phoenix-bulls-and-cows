import React from "react";
import { useState } from "react";

import "milligram";
import "../css/app.scss";

function Input(props) {
  const [inputString, setInputString] = useState("");
  let { makeGuess, reset, isObserver, leaveGame } = props;

  // Update input field
  function updateText(ev) {
    let currInput = ev.target.value;

    //Not allowing inputs of greater than 4
    if (currInput.length > 4) {
      return;
    }

    setInputString(currInput);
  }

  // If the user is an observer, disable the input field
  let inputField;
  if (isObserver()) {
    inputField = <input type="text" disabled></input>;
  } else {
    inputField = (
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
    );
  }

  return (
    <div className="container container-large">
      <div className="row">
        <div className="column column-20">
          <p>Input Guess: </p>
        </div>
        <div className="column column-35">{inputField}</div>
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
          <button onClick={leaveGame}>Leave</button>
        </div>
      </div>
    </div>
  );
}

export default Input;
