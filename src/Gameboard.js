import _ from "lodash";
import Button from "./Button";

export default function GameBoard({
  rows,
  cols,
  snakeMap,
  food,
  onReset,
  alive,
}) {
  return (
    <div className="border-gray-700 border relative">
      {_.range(0, rows).map((col) => (
        <div className="flex items-center " key={col}>
          {_.range(0, cols).map((row) => (
            <div
              className={`flex items-center justify-center w-4 h-4 ${
                snakeMap[row] && snakeMap[row][col] && "bg-green-400"
              }
                ${food && row === food[0] && col === food[1] && "bg-orange-300"}
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
            <Button onClick={onReset}>Play Again?</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
