import { useEffect } from "react";

function useSwipe(onSwipeLeft, onSwipeRight) {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 200;

    function handleTouchStart(event) {
      touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchMove(event) {
      const touchMoveX = event.changedTouches[0].screenX;
      // If horizontal swipe detected, prevent default
      if (Math.abs(touchMoveX - touchStartX) > swipeThreshold) {
        event.preventDefault();
      }
    }

    function handleTouchEnd(event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    }

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
    }

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}

export default useSwipe;
