import { useState } from "react";

function Square({ values, onClick }) {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const k = row * 3 + col;
            return (
              <button key={k} onClick={() => onClick(k)} className="square">
                {values[k]}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Board() {
  const [values, setValues] = useState([Array(9).fill(null)]);
  const [isXNext, setIsXNext] = useState(true);
  const currentValues = values[values.length - 1];

  function handleClick(i) {
    if (calculateWinner(currentValues) || currentValues[i]) return;

    const dupCurrentValues = currentValues.slice();
    if (isXNext) dupCurrentValues[i] = "X";
    else dupCurrentValues[i] = "O";

    setValues([...values, dupCurrentValues]);
    setIsXNext(!isXNext);
  }

  function movePosition(move) {
    setValues(values.slice(0, move + 1));
    setIsXNext(move % 2 === 0);
  }

  let status = "It's " + (isXNext ? "X" : "O") + "'s turn";
  const winner = calculateWinner(currentValues);
  if (winner) status = "Winner is " + winner;

  return (
    <>
      <div>{status}</div>
      <Square values={currentValues} onClick={handleClick} />
      <br />
      <div>
        Log:
        <History values={values} onRewind={movePosition} />
      </div>
    </>
  );
}

function History({ values, onRewind }) {
  return (
    <ol>
      {values.map((board, move) => {
        if (move === 0) return null;

        const previous = values[move - 1];
        for (let j = 0; j < board.length; j++) {
          if (board[j] !== previous[j]) {
            if (move < values.length - 1) {
              return (
                <li key={move}>
                  Player {board[j]} picked slot {j}
                  <button onClick={() => onRewind(move)}> Rewind </button>
                </li>
              );
            } else {
              return (
                <li key={move}>
                  Player {board[j]} picked slot {j}
                </li>
              );
            }
          }
        }
        return null;
      })}
    </ol>
  );
}

function calculateWinner(currentValues) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  for (let j = 0; j < combos.length; j++) {
    const [a, b, c] = combos[j];
    if (
      currentValues[a] &&
      currentValues[a] === currentValues[b] &&
      currentValues[a] === currentValues[c]
    ) {
      return currentValues[a];
    }
  }
  return null;
}
