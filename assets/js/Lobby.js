import React from "react";

import "milligram";
import "../css/app.scss";

// The lobby screen component
function Lobby(props) {
  const { setGameStarted } = props;

  return (
    <div>
      <h1>Bulls and Cows</h1>
      <div className="container">
        <div className="row">
          <div className="column">
            <h2>Lobby</h2>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <button onClick={setGameStarted}>Start Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
