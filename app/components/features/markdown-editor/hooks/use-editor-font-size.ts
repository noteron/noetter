import { useCallback, useMemo } from "react";
import { useEventListener } from "../../events";
import { GlobalEventType } from "../../events/event-types";
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
  useEventListener(GlobalEventType.EditorIncreaseFontSize, increaseFontSize);

  const decreaseFontSize = useCallback(
    () =>
      setFontSize(
        currentSizeOrDefault > INCREASE_DECREASE_STEP_SIZE
          ? currentSizeOrDefault - INCREASE_DECREASE_STEP_SIZE
          : INCREASE_DECREASE_STEP_SIZE
      ),
    [currentSizeOrDefault, setFontSize]
  );
  useEventListener(GlobalEventType.EditorDecreaseFontSize, decreaseFontSize);

  return currentSizeOrDefault;
};

export default useEditorFontSize;
