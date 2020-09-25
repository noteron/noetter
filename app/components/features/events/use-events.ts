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
    const first = eventQueue[0];
    if (!first) return;
    setEventQueue((prev: GlobalEventType[]): GlobalEventType[] =>
      prev.slice(1)
    );
    const handlers = eventListeners.filter((el) => el.eventType === first);
    handlers.forEach((h) => h.callback());
  }, [eventListeners, eventQueue]);

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
