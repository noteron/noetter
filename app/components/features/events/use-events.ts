import { useCallback, useState } from "react";
import {
  GlobalEventListener,
  GlobalEventType,
  EventContextState
} from "./event-types";

const useEvents = (): EventContextState => {
  const [eventListeners, setEventListeners] = useState<GlobalEventListener[]>(
    []
  );

  const registerEventListener = useCallback(
    (eventType: GlobalEventType, callback: () => void): number => {
      const reference: number =
        Math.round(Math.random() * 1000000) + Date.now();
      setEventListeners(
        (prev: GlobalEventListener[]): GlobalEventListener[] => [
          ...prev,
          { eventType, callback, reference }
        ]
      );
      return reference;
    },
    []
  );

  const unregisterEventListener = useCallback(
    (reference: number) =>
      setEventListeners((prev: GlobalEventListener[]): GlobalEventListener[] =>
        prev.filter((e) => e.reference !== reference)
      ),
    []
  );

  const triggerEvent = useCallback(
    async (eventType: GlobalEventType): Promise<void> =>
      new Promise<void>((resolve) => {
        const listenersToCall = eventListeners.filter(
          (e) => e.eventType === eventType
        );
        listenersToCall.forEach((listener) => {
          if (listener.callback) listener.callback();
        });
        resolve();
      }),
    [eventListeners]
  );

  return {
    registerEventListener,
    triggerEvent,
    unregisterEventListener
  };
};

export default useEvents;
