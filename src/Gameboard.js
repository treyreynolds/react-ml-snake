import _ from "lodash";

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
