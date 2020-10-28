import { useReducer, useEffect, useRef, useCallback } from "react";

const offsets = {
  n: [0, -1],
  s: [0, 1],
  e: [1, 0],
  w: [-1, 0],
};

const equals = (a, b) => a[0] === b[0] && a[1] === b[1];

const randomIndex = (length) => Math.trunc(Math.random() * length);

const addToSnakeMap = (map, [x, y]) => {
  map[x] = map[x] || {};
  map[x][y] = true;
};

const removeFromSnakeMap = (map, [x, y]) => {
  const row = map[x];
  delete row[y];
};

export function useSnake(cols, rows, speed) {
  const startCol = Math.trunc(cols / 2);
  const startRow = Math.trunc(rows / 2);

  const [game, action] = useReducer(
    ({ snake, snakeMap, alive, food, score, ticks }, action) => {
      switch (action.type) {
        case "move":
          ticks++;
          const [[x, y]] = snake;
          const [dX, dY] = offsets[action.value];
          const head = [x + dX, y + dY];

          if (
            head[0] > cols - 1 ||
            head[0] < 0 ||
            head[1] > rows - 1 ||
            head[1] < 0 ||
            snake.find((part) => equals(part, head))
          ) {
            alive = false;
          } else {
            snake = [head, ...snake];
            addToSnakeMap(snakeMap, head);

            if (food && equals(food, head)) {
              score++;
              food = null;
            } else {
              removeFromSnakeMap(snakeMap, snake.pop());

              if (food === null && Math.random() > 1 / 3) {
                const openCoords = [];

                for (let i = 0; i < cols - 1; i++) {
                  for (let j = 0; j < rows - 1; j++) {
                    if (!snakeMap[i] || !snakeMap[i][j]) {
                      openCoords.push([i, j]);
                    }
                  }
                }
                food = openCoords[randomIndex(openCoords.length)];
              }
            }
          }

          return {
            snake,
            snakeMap,
            alive,
            food,
            score,
            ticks,
          };

        case "reset":
          return {
            snake: [[startRow, startCol]],
            snakeMap: {
              [startRow]: {
                [startCol]: true,
              },
            },
            alive: true,
            food: null,
            score: 0,
            ticks: 0,
          };
        default:
          throw new Error();
      }
    },
    {
      snake: [[startRow, startCol]],
      snakeMap: {
        [startRow]: {
          [startCol]: true,
        },
      },
      alive: true,
      food: null,
      score: 0,
      ticks: 0,
    }
  );

  const directionRef = useRef("s");

  const updateDirection = useCallback((dir) => (directionRef.current = dir), [
    directionRef,
  ]);

  const resetGame = () => {
    action({ type: "reset" });
  };

  const { alive } = game;

  useEffect(() => {
    if (alive) {
      const interval = setInterval(() => {
        action({ type: "move", value: directionRef.current });
      }, speed);

      return () => clearInterval(interval);
    }
  }, [speed, alive]);

  return {
    resetGame,
    updateDirection,
    direction: directionRef.current,
    directionRef,
    ...game,
  };
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
