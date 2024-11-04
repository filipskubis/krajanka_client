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
      onTouchStart={(e) => {
        console.log("Touch start:", e);
        handleTouchStart();
      }}
      onTouchEnd={(e) => {
        console.log("Touch end:", e);
        handleTouchEnd();
      }}
      onMouseDown={(e) => {
        console.log("Mouse down:", e);
        handleTouchStart();
      }}
      onMouseUp={(e) => {
        console.log("Mouse up:", e);
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
