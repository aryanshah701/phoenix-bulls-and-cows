import React from "react";

import "milligram";
import "../css/app.scss";

// The lobby screen component
function Lobby(props) {
  const {
    gameName,
    userName,
    observers,
    players,
    setGameStarted,
    makePlayer,
    makeObserver,
    updateStatus,
  } = props;

  function statusString(status) {
    return status ? "READY" : "NOT READY";
  }

  // Converts a player with status to a string for UI
  function playerToString(player) {
    if (player[0]) {
      console.log("Player: " + player[0]);
      return player[0] + "(" + statusString(player[1]) + ")";
    } else {
      return "";
    }
  }

  // Converts the list of players to a string
  function playersToString(players) {
    if (players) {
      console.log(players);
      return players
        .map((player) => playerToString(player))
        .join(", ")
        .replace(/,\s*$/, "");
    } else {
      return "";
    }
  }

  return (
    <div>
      <h1>Bulls and Cows</h1>
      <div className="container">
        <div className="row">
          <div className="column">
            <div className="row">
              <div className="column">
                <h2>Lobby: {gameName}</h2>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <h2>User: {userName}</h2>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <button onClick={setGameStarted}>Start Game</button>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <button onClick={() => makeObserver(userName)}>Observer</button>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <button onClick={() => makePlayer(userName)}>Player</button>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <button onClick={() => updateStatus(true)}>Ready</button>
              </div>
            </div>
            <div className="row">
              <div className="column">
                <button onClick={() => updateStatus(false)}>Not Ready</button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="row">
              <p>Players: {playersToString(players)}</p>
            </div>
          </div>
          <div className="column">
            <p> Observers: {observers.toString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
