import { useState, useEffect } from "react";

function useSwipe(onSwipeLeft, onSwipeRight) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const threshold = 50; // Fixed threshold for swipe detection

  // Reset touch start and end after each swipe
  const resetTouch = () => {
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchMove = (e) => {
      setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;

      // Only consider it a swipe if the horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }

      resetTouch();
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight]);

  return null;
}

export default useSwipe;
