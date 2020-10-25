import { useState, useEffect, useRef } from "react";
import { useSnake } from "./hooks";
import _ from "lodash";
import * as ml5 from "ml5";

const columns = 30;
const rows = 20;

const options = {
  task: "classification",
  debug: true,
};

function App() {
  const [speed, setSpeed] = useState(166.67);
  const [isTrained, setIsTrained] = useState(false);
  const [guess, setGuess] = useState(null);
  let nn = useRef(ml5.neuralNetwork(options));

  const {
    history,
    snakeMap,
    food,
    alive,
    score,
    updateDirection,
    directionRef,
    resetGame,
  } = useSnake(columns, rows, speed);

  useEffect(() => {
    if (isTrained) {
      nn.current.classify(_.last(history), (err, res) => {
        console.log(_.maxBy(res, "confidence"));
        setGuess(_.maxBy(res, "confidence"));
      });
    }
  }, [history, isTrained]);

  useEffect(() => {
    if (guess) {
      updateDirection(guess.label);
    }
  }, [guess, updateDirection]);

  useEffect(() => {
    const cb = (e) => {
      switch (e.which) {
        case 37: // left
          if (directionRef.current !== "e") {
            updateDirection("w");
          }

          break;
        case 38: // up
          if (directionRef.current !== "s") {
            updateDirection("n");
          }
          break;
        case 39: // right
          if (directionRef.current !== "w") {
            updateDirection("e");
          }
          break;
        case 40: // down
          if (directionRef.current !== "n") {
            updateDirection("s");
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", cb);
    return () => {
      window.removeEventListener("keydown", cb);
    };
  }, [directionRef, updateDirection]);

  const handleResetGame = () => {
    resetGame();
  };

  const handleTraining = (e) => {
    e.preventDefault();
    history.forEach((item) => {
      const { direction, ...rest } = item;
      const inputs = rest;
      const output = {
        direction,
      };

      nn.current.addData(inputs, output);
    });

    // Step 5: normalize your data;
    nn.current.normalizeData();

    // Step 6: train your neural network
    const trainingOptions = {
      epochs: 32,
      batchSize: 12,
    };
    nn.current.train(trainingOptions, () => setIsTrained(true));
  };

  return (
    <div className="flex items-center justify-around h-screen bg-gray-800">
      <GameBoard
        snakeMap={snakeMap}
        food={food}
        onReset={handleResetGame}
        alive={alive}
      />
      <div className="flex flex-col justify-center p-5 bg-gray-600 h-full">
        <div className="p-3 bg-gray-400 mb-2">SCORE: {score}</div>
        {history.length > 0 &&
          history.slice(-10).map((h, i) => (
            <div key={i} className="flex items-center mb-1 bg-gray-500">
              {Object.keys(h).map((key) => (
                <div key={key} className="w-24 mx-2">
                  {key.replace("to", "").replace("Wall", "")}: {h[key]}
                </div>
              ))}
            </div>
          ))}
        <div className="flex items-center justify-between mt-3 bg-gray-400 p-2">
          <span className="inline-flex rounded-md shadow-sm">
            <button
              onClick={handleTraining}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
            >
              Train Model
            </button>
          </span>
          {guess && (
            <div className="text-indigo-500">
              Guess: {guess.label}, {Math.round(guess.confidence * 100)}%
            </div>
          )}

          <div>
            Is Trained: <strong>{isTrained ? "Yes" : "No"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function GameBoard({ snakeMap, food, onReset, alive }) {
  return (
    <div className="border-gray-700 border-t border-r relative">
      {_.range(0, rows).map((col) => (
        <div className="flex items-center " key={col}>
          {_.range(0, columns).map((row) => (
            <div
              className={`flex items-center justify-center w-6 h-6 border-l border-b border-gray-700 ${
                snakeMap[row] && snakeMap[row][col] && "bg-green-400"
              }
                ${food && row === food[0] && col === food[1] && "bg-teal-500"}
                `}
              key={row}
            />
          ))}
        </div>
      ))}
      <div
        className={`absolute ${
          alive ? "hidden" : ""
        } inset-0 flex items-center justify-center`}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-48 h-24 flex items-center justify-center text-white bg-gray-900">
            <h2>You died.</h2>
          </div>
          <div className="w-48 bg-gray-700 p-3 flex items-center justify-end">
            <span className="inline-flex rounded-md shadow-sm">
              <button
                onClick={onReset}
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
              >
                Play Again?
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
