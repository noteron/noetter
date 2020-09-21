import { useCallback, useContext, useEffect, useState } from "react";
import EventContext from "../event-context";
import { GlobalEventType } from "../event-types";

const useEventListener = (
  eventType: GlobalEventType,
  callback?: () => void
) => {
  const { registerEventListener, unregisterEventListener } = useContext(
    EventContext
  );
  const [queue, setQueue] = useState<GlobalEventType[]>([]);

  const handleNextInQueue = useCallback(() => {
    setQueue((prev: GlobalEventType[]): GlobalEventType[] => {
      const [current, ...other] = queue;
      if (!current) return prev;
      if (callback) callback();
      return other;
    });
  }, [callback, queue]);

  useEffect(() => {
    if (!queue) return;
    handleNextInQueue();
  });

  const addToQueue = useCallback((): void => {
    setQueue((prev: GlobalEventType[]): GlobalEventType[] => [
      ...prev,
      eventType
    ]);
  }, [eventType]);

  useEffect(() => {
    if (registerEventListener && unregisterEventListener) {
      registerEventListener(eventType, addToQueue);
      return () => unregisterEventListener(addToQueue);
    }
    return undefined;
  }, [addToQueue, eventType, registerEventListener, unregisterEventListener]);
};

export default useEventListener;
