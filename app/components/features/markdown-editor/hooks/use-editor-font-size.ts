import { useCallback, useMemo } from "react";
import useKeyboardShortcut from "../../keyboard-shortcuts";
import shortcuts from "../../keyboard-shortcuts/shortcuts";
import { ShortcutIdentifiers } from "../../keyboard-shortcuts/types";
import LocalStorageKeys from "../../local-storage-state/local-storage-keys";
import useLocalStorageState from "../../local-storage-state/use-local-storage-state";

const DEFAULT_FONT_SIZE = 14;
const INCREASE_DECREASE_STEP_SIZE = 4;

const useEditorFontSize = (): number => {
  const [fontSize, setFontSize] = useLocalStorageState<number>(
    LocalStorageKeys.EditorFontSize,
    14
  );

  const currentSizeOrDefault = useMemo<number>(
    () => fontSize ?? DEFAULT_FONT_SIZE,
    [fontSize]
  );

  const increaseFontSize = useCallback(
    () => setFontSize(currentSizeOrDefault + INCREASE_DECREASE_STEP_SIZE),
    [currentSizeOrDefault, setFontSize]
  );

  useKeyboardShortcut(
    shortcuts[ShortcutIdentifiers.IncreaseFontSize],
    increaseFontSize
  );

  const decreaseFontSize = useCallback(
    () =>
      setFontSize(
        currentSizeOrDefault > INCREASE_DECREASE_STEP_SIZE
          ? currentSizeOrDefault - INCREASE_DECREASE_STEP_SIZE
          : INCREASE_DECREASE_STEP_SIZE
      ),
    [currentSizeOrDefault, setFontSize]
  );

  useKeyboardShortcut(
    shortcuts[ShortcutIdentifiers.DecreaseFontSize],
    decreaseFontSize
  );

  return currentSizeOrDefault;
};

export default useEditorFontSize;
