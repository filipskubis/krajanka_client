/* eslint-disable react/prop-types */
function HoldButton({ click, hold, children }) {
  let timer;

  const handleTouchStart = () => {
    timer = setTimeout(() => {
      hold();
    }, 1000);
  };

  const handleTouchEnd = () => {
    clearTimeout(timer);
  };

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onClick={(e) => {
        e.preventDefault();
        click();
      }}
    >
      {children}
    </button>
  );
}

export default HoldButton;
