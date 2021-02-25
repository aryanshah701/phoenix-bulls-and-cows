import React from 'react';
import { channelJoin } from './socket';
import { useState } from 'react'

import 'milligram';
import '../css/app.scss';

function EnterGameScreen(props) {
  const [input, setInput] = useState('');
  const { setGameStarted, visualReset, setState } = props;

  //Update input field
  function updateText(ev) {
    let currInput = ev.target.value;
    setInput(currInput);
  }

  //Start game
  function startGame() {
    let gameName = input;

    // Empty gameName not allowed
    if (gameName == "") {
      return;
    }

    // Clear the input field
    setInput("");

    // Start the game
    setGameStarted(true, gameName);
  }

  return (
    <div className="container" id="enter-game-screen">
      <div className="row">
        <div className="column">
          <h1>Bulls and Cows</h1>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <input type="text"    
            type="text"
            value={input}
            onChange={updateText}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                startGame();
              }
            }}
          ></input>
          <button onClick={() => startGame()}>Start Game</button>
        </div>
      </div>
    </div>
  );
}

export default EnterGameScreen;