import { useCallback, useState } from "react";
import useKeyboardShortcut from "../features/keyboard-shortcuts";
import shortcuts from "../features/keyboard-shortcuts/shortcuts";
import { ShortcutIdentifiers } from "../features/keyboard-shortcuts/types";

const useZenMode = (): boolean => {
  const [zenMode, setZenMode] = useState<boolean>(false);

  const toggleZenMode = useCallback(() => {
    setZenMode((prev: boolean) => !prev);
    window.dispatchEvent(new Event("resize"));
  }, []);

  useKeyboardShortcut(
    shortcuts[ShortcutIdentifiers.ToggleZenMode],
    toggleZenMode
  );

  return zenMode;
};

export default useZenMode;
