import React from "react";

import "milligram";
import "../css/app.scss";

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

export default GameOver;
