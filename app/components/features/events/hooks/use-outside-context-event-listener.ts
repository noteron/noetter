import { useEffect } from "react";
import { EventContextState, GlobalEventType } from "../event-types";

const useOutsideContextEventListener = (
  eventType: GlobalEventType,
  callback: () => void | undefined,
  { registerEventListener, unregisterEventListener }: EventContextState
) => {
  useEffect(() => {
    if (registerEventListener && unregisterEventListener && callback) {
      registerEventListener(eventType, callback);
      return () => unregisterEventListener(callback);
    }
    return undefined;
  }, [callback, eventType, registerEventListener, unregisterEventListener]);
};

export default useOutsideContextEventListener;
