import { useCallback, useEffect } from "react";
import { Shortcut } from "./types";

const keyDownEvent = "keydown";

const useKeyboardShortcut = (shortcut: Shortcut, callback: () => void) => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent): void => {
      if (
        shortcut.keyCombination.ctrlKey === event.ctrlKey &&
        shortcut.keyCombination.altKey === event.altKey &&
        shortcut.keyCombination.key === event.key
      )
        callback();
    },
    [
      callback,
      shortcut.keyCombination.altKey,
      shortcut.keyCombination.ctrlKey,
      shortcut.keyCombination.key
    ]
  );

  useEffect(() => {
    document.addEventListener(keyDownEvent, handleKeydown);
    return () => document.removeEventListener(keyDownEvent, handleKeydown);
  });
};

export default useKeyboardShortcut;
