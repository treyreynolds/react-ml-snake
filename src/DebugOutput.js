import { useState } from "react";
import Button from "./Button";

export default function DebugOutput({ history, score }) {
  const [showTrainingData, setShowTrainingData] = useState(false);

  return (
    <div className="flex flex-col justify-center p-5 bg-gray-800 h-full w-1/2">
      <div className="flex items-center justify-between p-3 bg-gray-900 mb-2 text-white">
        <div className="flex items-center">
          <div className="w-24">SCORE: {score}</div>
          <div>Training Values: {history.length}</div>
        </div>
        <Button
          onClick={() => setShowTrainingData(!showTrainingData)}
          color="green"
        >
          Show Training
        </Button>
      </div>
      <div className="flex items-center justify-around">
        {history[0] &&
          Object.keys(history[0]).map((key) => (
            <div key={key} className="w-16 mx-2 text-gray-300">
              {key.replace("to", "").replace("Wall", "")}
            </div>
          ))}
      </div>
      {history.length > 0 &&
        history.slice(-10).map((h, i) => (
          <div
            key={i}
            className="flex items-center mb-1 justify-around bg-gray-900 text-white"
          >
            {Object.keys(h).map((key) => (
              <div key={key} className="w-16 mx-2 text-center">
                {h[key]}
              </div>
            ))}
          </div>
        ))}

      {showTrainingData && (
        <div className="flex items-center justify-center w-full mt-3 p-3 text-xs bg-gray-400">
          <textarea className="text-xs border p-3 w-full" rows={15}>
            {JSON.stringify(history)}
          </textarea>
        </div>
      )}
    </div>
  );
}
