import React from "react";
import { useState } from "react";

import "milligram";
import "../css/app.scss";

function Header() {
  return (
    <div className="container">
      <div className="row">
        <div className="column column-10 center">Name</div>
        <div className="column column-45 center">Guess</div>
        <div className="column column-45 center">Result</div>
      </div>
    </div>
  );
}

function Guess(props) {
  let { idx, guess, result } = props;
  let username = "";
  let guessValue = "";

  if (guess) {
    username = guess[0];
    guessValue = guess[1];
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column column-40 center">{username}</div>
        <div className="column column-30 center">{guessValue}</div>
        <div className="column column-30 center">{result}</div>
      </div>
    </div>
  );
}

function GuessTable(props) {
  let { results, guesses, username } = props;

  return (
    <div className="container">
      <Header />
      <div className="row">
        <div className="column">
          <Guess
            idx={1}
            user={username}
            guess={guesses[0]}
            result={results[0]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={2}
            user={username}
            guess={guesses[1]}
            result={results[1]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={3}
            user={username}
            guess={guesses[2]}
            result={results[2]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={4}
            user={username}
            guess={guesses[3]}
            result={results[3]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={5}
            user={username}
            guess={guesses[4]}
            result={results[4]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={6}
            user={username}
            guess={guesses[5]}
            result={results[5]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={7}
            user={username}
            guess={guesses[6]}
            result={results[6]}
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guess
            idx={8}
            user={username}
            guess={guesses[7]}
            result={results[7]}
          />
        </div>
      </div>
    </div>
  );
}

export default GuessTable;
