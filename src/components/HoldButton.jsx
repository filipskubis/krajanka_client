import { useState } from "react";

/* eslint-disable react/prop-types */
function HoldButton({ click, hold, children }) {
  const [timer, setTimer] = useState(null);

  const handleTouchStart = () => {
    setTimer(
      setTimeout(() => {
        hold();
      }, 1000)
    );
  };

  const handleTouchEnd = () => {
    clearTimeout(timer);
  };

  return (
    <button
      onTouchStart={() => {
        handleTouchStart();
      }}
      onTouchEnd={() => {
        handleTouchEnd();
      }}
      onMouseDown={() => {
        handleTouchStart();
      }}
      onMouseUp={() => {
        handleTouchEnd();
      }}
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
