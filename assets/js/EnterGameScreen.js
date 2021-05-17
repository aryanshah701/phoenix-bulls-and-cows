import React from "react";
import { useState } from "react";

import "milligram";
import "../css/app.scss";

// Initial game screen component
function EnterGameScreen(props) {
  // State to control input
  const [state, setState] = useState({
    gameName: "",
    userName: "",
  });
  const input = state.gameName;
  const userName = state.userName;

  const { setGameJoined } = props;

  //Update gameName field
  function updateText(ev) {
    let currInput = ev.target.value;
    setState({
      ...state,
      gameName: currInput,
    });
  }

  //Update userName field
  function updateUserText(ev) {
    let currInput = ev.target.value;
    setState({
      ...state,
      userName: currInput,
    });
  }

  //Start game
  function joinGame() {
    let gameName = state.gameName;
    let userName = state.userName;

    // Empty gameName not allowed
    if (gameName == "" || userName == "") {
      return;
    }

    // Join the game
    setGameJoined(gameName, userName);

    // Clear the input field
    setState({
      gameName: "",
      userName: "",
    });
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
          <input
            type="text"
            value={input}
            placeholder="Game Name"
            onChange={updateText}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                joinGame();
              }
            }}
          ></input>
          <input
            type="text"
            value={userName}
            placeholder="User Name"
            onChange={updateUserText}
            onKeyPress={(ev) => {
              if (ev.key === "Enter") {
                joinGame();
              }
            }}
          ></input>
          <button onClick={joinGame}>Join Game</button>
        </div>
      </div>
    </div>
  );
}

export default EnterGameScreen;
