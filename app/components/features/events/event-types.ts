export enum GlobalEventType {
  ZenModeShortcutTrigger = "ZenModeShortcutTrigger"
}

export type GlobalEventListener = {
  eventType: GlobalEventType;
  callback: () => void;
  reference: string;
};

export type EventContextState = {
  registerEventListener?: (
    eventType: GlobalEventType,
    callback: () => void
  ) => string;
  unregisterEventListener?: (reference: string) => void;
  queueEvent?: (eventType: GlobalEventType) => void;
};
