import { useCallback, useEffect, useState } from "react";
import { EventContextState, GlobalEventType } from "../event-types";

const useOutsideContextEventListener = (
  eventType: GlobalEventType,
  callback: () => void | undefined,
  { registerEventListener, unregisterEventListener }: EventContextState
) => {
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

export default useOutsideContextEventListener;
