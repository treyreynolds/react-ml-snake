export default function DebugOutput({ history, score }) {
  return (
    <div className="flex flex-col justify-center p-5 bg-gray-800 h-full">
      <div className="p-3 bg-gray-900 mb-2 text-white">SCORE: {score}</div>
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
            className="flex items-center mb-1 bg-gray-900 text-white"
          >
            {Object.keys(h).map((key) => (
              <div key={key} className="w-16 mx-2 text-center">
                {h[key]}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
