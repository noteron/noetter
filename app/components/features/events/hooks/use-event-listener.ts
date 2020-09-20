import { useContext, useEffect } from "react";
import EventContext from "../event-context";
import { GlobalEventType } from "../event-types";

const useEventListener = (
  eventType: GlobalEventType,
  callback?: () => void
) => {
  const { registerEventListener, unregisterEventListener } = useContext(
    EventContext
  );

  useEffect(() => {
    if (registerEventListener && unregisterEventListener && callback) {
      registerEventListener(eventType, callback);
      return () => unregisterEventListener(callback);
    }
    return undefined;
  }, [callback, eventType, registerEventListener, unregisterEventListener]);
};

export default useEventListener;
