import './App.css';
import { useState, useEffect } from 'react';
import { useInterval, useSnake } from './hooks';
import _ from 'lodash';

const columns = 30;
const rows = 20;

function App() {
  const [speed, setSpeed] = useState(200);
  const {
    snakeMap,
    food,
    alive,
    score,
    updateDirection,
    directionRef,
    resetGame,
  } = useSnake(columns, rows, speed);

  useInterval(() => {
    setSpeed(speed - 5);
  }, 2000);

  useEffect(() => {
    const cb = (e) => {
      switch (e.which) {
        case 37: // left
          if (directionRef.current !== 'e') {
            updateDirection('w');
          }

          break;
        case 40: // up
          if (directionRef.current !== 's') {
            updateDirection('n');
          }
          break;
        case 39: // right
          if (directionRef.current !== 'w') {
            updateDirection('e');
          }
          break;
        case 38: // down
          if (directionRef.current !== 'n') {
            updateDirection('s');
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', cb);
    return () => {
      window.removeEventListener('keydown', cb);
    };
  }, [directionRef, updateDirection]);

  const handleResetGame = () => {
    setSpeed(200);
    resetGame();
  };

  return (
    <div className="App">
      <div className="GameBoard">
        {_.range(0, rows).map((col) => (
          <div className="GameRow" key={col}>
            {_.range(0, columns).map((row) => (
              <div
                className={`GameCell ${
                  snakeMap[row] && snakeMap[row][col] && 'cell-active'
                }
                ${food && row === food[0] && col === food[1] && 'cell-food'}
                `}
                key={row}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
