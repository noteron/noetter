import { useCallback, useEffect, useState } from "react";
import {
  EventContextState,
  GlobalEventType
} from "../features/events/event-types";

const useZenMode = ({
  registerEventListener,
  unregisterEventListener
}: EventContextState): boolean => {
  const [zenMode, setZenMode] = useState<boolean>(false);

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  useEffect(() => {
    if (registerEventListener && unregisterEventListener) {
      const reference = registerEventListener(
        GlobalEventType.ZenModeShortcutTrigger,
        toggleZenMode
      );
      return () => unregisterEventListener(reference);
    }
    return undefined;
  }, [registerEventListener, toggleZenMode, unregisterEventListener]);

  return zenMode;
};

export default useZenMode;
