export default function Button({ children, className, onClick, size, color }) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  const padding = size === "large" ? "px-6 py-3" : "px-4 py-2";

  const tailwindColor = color || "indigo";

  const classes = `
    focus:outline-none
    inline-flex items-center
    ${padding}
    border border-transparent 
    text-sm leading-4 font-medium rounded-md 
    text-white
    bg-${tailwindColor}-600 
    hover:bg-${tailwindColor}-500 
    focus:border-${tailwindColor}-700 
    focus:shadow-outline-${tailwindColor} 
    active:bg-${tailwindColor}-700 
    transition ease-in-out duration-150 ${className}`;

  return (
    <button type="button" onClick={handleClick} className={classes}>
      {children}
    </button>
  );
}
