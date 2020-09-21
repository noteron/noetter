import { useCallback, useState } from "react";
import { useOutsideContextEventListener } from "../features/events";
import {
  EventContextState,
  GlobalEventType
} from "../features/events/event-types";

const useZenMode = (events: EventContextState): boolean => {
  const [zenMode, setZenMode] = useState<boolean>(false);

  const toggleZenMode = useCallback(
    () => setZenMode((prev: boolean) => !prev),
    []
  );

  useOutsideContextEventListener(
    GlobalEventType.WindowZenModeShortcutTrigger,
    toggleZenMode,
    events
  );

  return zenMode;
};

export default useZenMode;
