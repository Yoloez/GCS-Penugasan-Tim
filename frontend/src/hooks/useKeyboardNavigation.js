import { useEffect } from "react";

const useKeyboardNavigation = ({ enabled, onMove, onEnter, onCancel }) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          e.preventDefault();
          onMove(0, 0.0001);
          break;

        case "s":
        case "ArrowDown":
          e.preventDefault();
          onMove(0, -0.0001);
          break;

        case "a":
        case "ArrowLeft":
          e.preventDefault();
          onMove(-0.0001, 0);
          break;

        case "d":
        case "ArrowRight":
          e.preventDefault();
          onMove(0.0001, 0);
          break;

        case "Enter":
          e.preventDefault();
          if (onEnter) onEnter();
          break;

        case "Escape":
          e.preventDefault();
          if (onCancel) onCancel();
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onMove, onEnter, onCancel]);
};

export default useKeyboardNavigation;
