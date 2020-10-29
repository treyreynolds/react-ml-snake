import { useState, useEffect, useRef } from "react";
import { useSnake } from "./hooks";
import _ from "lodash";
import * as ml5 from "ml5";

import GameBoard from "./Gameboard";
import DebugOutput from "./DebugOutput";
import Button from "./Button";

import prebuiltTrainingData from "./training.json";

const cols = 40;
const rows = 30;

const options = {
  task: "classification",
  debug: true,
};

function App() {
  const [autoplay, setAutoplay] = useState(false);
  const [history, setHistory] = useState([]);
  const [isTrained, setIsTrained] = useState(false);
  const [guess, setGuess] = useState(null);
  const [fps, setFps] = useState(8);

  let nn = useRef(ml5.neuralNetwork(options));
  const speed = 1000 / fps;

  const {
    snake,
    snakeMap,
    food,
    alive,
    score,
    updateDirection,
    directionRef,
    resetGame,
    ticks,
  } = useSnake(cols, rows, speed);

  useEffect(() => {
    setHistory([
      ...history,
      calculateHistory(snake, food, directionRef.current),
    ]);
  }, [ticks]);

  useEffect(() => {
    if (isTrained) {
      nn.current.classify(_.last(history), (err, res) => {
        const bestGuess = _.maxBy(res, "confidence");
        setGuess(bestGuess);
      });
    }
  }, [history, isTrained]);

  useEffect(() => {
    if (guess) {
      updateDirection(guess.label);
    }
  }, [guess, updateDirection, directionRef]);

  useEffect(() => {
    const cb = (e) => {
      switch (e.which) {
        case 37: // left
          updateDirection("w");
          break;
        case 38: // up
          updateDirection("n");
          break;
        case 39: // right
          updateDirection("e");
          break;
        case 40: // down
          updateDirection("s");
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

  useEffect(() => {
    if (!alive && autoplay) {
      resetGame();
    }
  }, [autoplay, resetGame, alive]);

  const handleResetGame = () => {
    resetGame();
  };

  const handleTraining = () => {
    train(history);
  };

  const handlePrebuiltTraining = () => {
    train(prebuiltTrainingData);
  };

  const train = (values) => {
    values.forEach((item) => {
      const { direction, ...rest } = item;
      const inputs = rest;
      const output = {
        direction,
      };

      nn.current.addData(inputs, output);
    });

    // Since data is different dimensions we have to normalize it
    nn.current.normalizeData();

    // These training options are the default, no id if they should be set differently
    const trainingOptions = {
      batchSize: 64,
      epochs: 200,
    };
    nn.current.train(trainingOptions, () => setIsTrained(true));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex items-center justify-between mb-3 bg-gray-400 p-2">
        <div className="flex items-center">
          <Button
            onClick={handlePrebuiltTraining}
            color="indigo"
            className="mr-3"
          >
            Train With Prebuilt Model
          </Button>
          <Button onClick={handleTraining} color="indigo" className="mr-3">
            Train Model
          </Button>

          <Button
            className="mr-3"
            onClick={() => setAutoplay(!autoplay)}
            color={autoplay ? "orange" : "green"}
          >
            {autoplay ? "Stop Autoplay" : "Start Autoplay"}
          </Button>
          <input
            onChange={(e) => setFps(e.target.value)}
            type="number"
            value={fps}
            className="border px-2 py-1 w-24"
          />
        </div>

        {guess && (
          <div className="text-indigo-500">
            Guess: {guess.label}, {Math.round(guess.confidence * 100)}%
          </div>
        )}

        <div>
          Is Trained: <strong>{isTrained ? "Yes" : "No"}</strong>
        </div>
      </div>
      <div className="flex items-center justify-around">
        <GameBoard
          snakeMap={snakeMap}
          food={food}
          onReset={handleResetGame}
          alive={alive}
          rows={rows}
          cols={cols}
        />
        <DebugOutput
          history={history}
          score={score}
          onTrain={handleTraining}
          guess={guess}
          isTrained={isTrained}
        />
      </div>
    </div>
  );
}

export default App;

function calculateHistory(snake, food, direction) {
  const head = snake[0];

  const dNorth = food ? Math.max(head[1] - food[1], 0) : 0;
  const dSouth = food ? Math.max(food[1] - head[1], 0) : 0;
  const dEast = food ? Math.max(food[0] - head[0], 0) : 0;
  const dWest = food ? Math.max(head[0] - food[0], 0) : 0;

  //const fAngle = food ? angleBetweenTwoPoints(food, head, direction) : 0;

  return {
    dEast,
    dWest,
    dNorth,
    dSouth,
    //fAngle,
    direction,
  };
}

function distanceBetweenPoints(p1, p2) {
  const dx = Math.abs(p1[0] - p2[0]);
  const dy = Math.abs(p1[1] - p2[1]);

  const distance = Math.hypot(dx, dy);
  return Math.round(distance * 10) / 10;
}

function angleBetweenTwoPoints(p1, p2, direction) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];

  let angle = 0;

  switch (direction) {
    case "n":
      angle = (Math.atan2(-1 * dx, -1 * dy) * 180) / Math.PI;
      break;
    case "s":
      angle = (Math.atan2(dx, dy) * 180) / Math.PI;
      break;
    case "w":
      angle = (Math.atan2(-1 * dy, -1 * dx) * 180) / Math.PI;
      break;
    case "e":
      angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      break;
    default:
      break;
  }

  return Math.round(angle * 10) / 10;
}
//
// function calculateObstacles(rows, cols, head, direction) {
//   const x = 0;
//   const y = 1;
//
//   const forwardObstacle =
//     (direction === "s" && head[y] >= rows) ||
//     (direction === "n" && head[y] === 0) ||
//     (direction === "e" && head[x] >= cols) ||
//     (direction === "w" && head[x] === 0)
//       ? 1
//       : -1;
//
//   const leftObstacle =
//     (direction === "s" && head[x] === cols - 1) ||
//     (direction === "n" && head[x] === 0) ||
//     (direction === "e" && head[y] === 0) ||
//     (direction === "w" && head[y] === rows - 1)
//       ? 1
//       : -1;
//
//   const rightObstacle =
//     (direction === "s" && head[x] === 0) ||
//     (direction === "n" && head[x] === cols - 1) ||
//     (direction === "e" && head[y] === rows - 1) ||
//     (direction === "w" && head[y] === 0)
//       ? 1
//       : -1;
//
//   return [forwardObstacle, leftObstacle, rightObstacle];
// }
//
// function foodDirection(head, food, direction) {
//   const x = 0;
//   const y = 1;
//   const foodForward =
//     (direction === "s" && head[x] === food[x] && head[y] < food[y]) ||
//     (direction === "n" && head[x] === food[x] && head[y] > food[y]) ||
//     (direction === "e" && head[y] === food[y] && head[x] < food[x]) ||
//     (direction === "w" && head[y] === food[y] && head[x] > food[x])
//       ? 1
//       : -1;
//
//   const foodLeft =
//     (direction === "s" && head[x] < food[x]) ||
//     (direction === "n" && head[x] > food[x]) ||
//     (direction === "e" && head[y] > food[y]) ||
//     (direction === "w" && head[y] < food[y])
//       ? 1
//       : -1;
//
//   const foodRight =
//     (direction === "s" && head[x] > food[x]) ||
//     (direction === "n" && head[x] < food[x]) ||
//     (direction === "e" && head[y] < food[y]) ||
//     (direction === "w" && head[y] > food[y])
//       ? 1
//       : -1;
//
//   return [foodForward, foodLeft, foodRight];
// }
