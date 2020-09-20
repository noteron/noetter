export enum GlobalEventType {
  ZenModeShortcutTrigger = "ZenModeShortcutTrigger"
}

export type GlobalEventListener = {
  eventType: GlobalEventType;
  callback: () => void;
};

export type EventContextState = {
  registerEventListener?: (
    eventType: GlobalEventType,
    callback: () => void
  ) => void;
  unregisterEventListener?: (reference: () => void) => void;
  queueEvent?: (eventType: GlobalEventType) => void;
};
