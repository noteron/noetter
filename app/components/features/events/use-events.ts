import { useCallback, useEffect, useState } from "react";
import {
  GlobalEventListener,
  GlobalEventType,
  EventContextState
} from "./event-types";

const useEvents = (): EventContextState => {
  const [eventListeners, setEventListeners] = useState<GlobalEventListener[]>(
    []
  );
  const [eventQueue, setEventQueue] = useState<GlobalEventType[]>([]);

  const handleNextEvent = useCallback(() => {
    setEventQueue((prev: GlobalEventType[]): GlobalEventType[] => {
      const [current, ...other] = prev;
      const handlers = eventListeners.filter((el) => el.eventType === current);
      handlers.forEach((h) => {
        if (h.callback) h.callback();
      });
      return other;
    });
  }, [eventListeners]);

  useEffect(() => {
    if (!eventQueue.length) return;
    handleNextEvent();
  }, [eventQueue.length, handleNextEvent]);

  const registerEventListener = useCallback(
    (eventType: GlobalEventType, callback: () => void): void => {
      setEventListeners(
        (prev: GlobalEventListener[]): GlobalEventListener[] => [
          ...prev,
          { eventType, callback }
        ]
      );
    },
    []
  );

  const unregisterEventListener = useCallback((reference: () => void) => {
    setEventListeners((prev: GlobalEventListener[]): GlobalEventListener[] =>
      prev.filter((e) => e.callback !== reference)
    );
  }, []);

  const queueEvent = useCallback(
    (eventType: GlobalEventType): void =>
      setEventQueue((prev: GlobalEventType[]): GlobalEventType[] => [
        ...prev,
        eventType
      ]),
    []
  );

  return {
    registerEventListener,
    queueEvent,
    unregisterEventListener
  };
};

export default useEvents;
