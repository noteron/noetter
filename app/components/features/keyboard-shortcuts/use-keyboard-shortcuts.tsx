import { useCallback, useEffect, useState } from "react";
import { EventContextState, GlobalEventType } from "../events/event-types";
import shortcutMap from "./shortcut-map";
import { Shortcut } from "./types";

const keyDownEvent = "keydown";

const useKeyboardShortcuts = ({ queueEvent }: EventContextState) => {
  const [shortcuts] = useState<Shortcut[]>(shortcutMap);
  const [queue, setQueue] = useState<GlobalEventType[]>([]);

  const handleNextInQueue = useCallback(() => {
    setQueue((prev: GlobalEventType[]): GlobalEventType[] => {
      const [current, ...other] = prev;
      if (!queueEvent || !current) return prev;
      queueEvent(current);
      return other;
    });
  }, [queueEvent]);

  useEffect(() => {
    if (!queue) return;
    handleNextInQueue();
  }, [handleNextInQueue, queue]);

  const handleKeydown = useCallback(
    (shortcutDefinition: Shortcut, event: KeyboardEvent): void => {
      if (
        shortcutDefinition.keyCombination.ctrlKey === event.ctrlKey &&
        shortcutDefinition.keyCombination.altKey === event.altKey &&
        event.key === shortcutDefinition.keyCombination.key
      )
        setQueue((prev: GlobalEventType[]): GlobalEventType[] => [
          ...prev,
          shortcutDefinition.eventType
        ]);
    },
    []
  );

  useEffect((): (() => void) => {
    if (!shortcuts) return () => undefined;
    const callbacks: ((event: KeyboardEvent) => void)[] = [];
    shortcuts.forEach((s) => {
      const callback = (event: KeyboardEvent) => handleKeydown(s, event);
      document.addEventListener(keyDownEvent, callback);
      callbacks.push(callback);
    });
    return () => {
      callbacks.forEach((c) => document.removeEventListener(keyDownEvent, c));
    };
  }, [handleKeydown, shortcuts]);
};

export default useKeyboardShortcuts;
