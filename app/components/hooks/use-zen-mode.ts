import { useCallback, useState } from "react";
import {
  EventContextState,
  GlobalEventType
} from "../features/events/event-types";
import useOutsideContextEventListener from "../features/events/hooks/use-outside-context-event-listener";

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
