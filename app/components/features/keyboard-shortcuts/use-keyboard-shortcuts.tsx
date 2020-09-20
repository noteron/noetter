import { useCallback, useEffect, useState } from "react";
import { EventContextState, GlobalEventType } from "../events/event-types";
import shortcutMap from "./shortcut-map";
import { Shortcut } from "./types";

const keyDownEvent = "keydown";

const useKeyboardShortcuts = ({ queueEvent }: EventContextState) => {
  const [shortcuts] = useState<Shortcut[]>(shortcutMap);

  const handleShortcutTriggered = useCallback(
    (eventType: GlobalEventType) => {
      if (queueEvent) {
        queueEvent(eventType);
      }
    },
    [queueEvent]
  );

  const handleKeydown = useCallback(
    (shortcutDefinition: Shortcut, event: KeyboardEvent): void => {
      if (
        shortcutDefinition.keyCombination.ctrlKey === event.ctrlKey &&
        shortcutDefinition.keyCombination.altKey === event.altKey &&
        event.key === shortcutDefinition.keyCombination.key
      )
        handleShortcutTriggered(shortcutDefinition.eventType);
    },
    [handleShortcutTriggered]
  );

  useEffect((): (() => void) => {
    if (!shortcuts) return () => undefined;
    const callbacks: ((event: KeyboardEvent) => void)[] = [];
    shortcuts.forEach((s) => {
      const callback = (event: KeyboardEvent) => handleKeydown(s, event);
      document.addEventListener(keyDownEvent, callback);
      callbacks.push(callback);
      console.log("SHORTCUT REGISTRATED: ", s.name);
    });
    return () => {
      callbacks.forEach((c) => document.removeEventListener(keyDownEvent, c));
    };
  }, [handleKeydown, handleShortcutTriggered, shortcuts]);
};

export default useKeyboardShortcuts;
