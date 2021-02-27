import React from "react";

import "milligram";
import "../css/app.scss";

function GameOver(props) {
  const { reset, won, winner } = props;
  let message = "";

  if (won) {
    message = "You Won!";
  } else {
    message = "Sorry, you lost! The winner was " + winner;
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

export default GameOver;
