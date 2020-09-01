import { useEffect, useCallback } from "react";

export type KeyCombination = {
  ctrlKey: boolean;
  altKey: boolean;
  key: string;
};

const useShortcut = (
  keyCombination: KeyCombination,
  callback: () => void
): void => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent): void => {
      if (
        keyCombination.ctrlKey === event.ctrlKey &&
        keyCombination.altKey === event.altKey &&
        event.key === keyCombination.key &&
        callback
      )
        callback();
    },
    [
      callback,
      keyCombination.altKey,
      keyCombination.ctrlKey,
      keyCombination.key
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);
};

export default useShortcut;
