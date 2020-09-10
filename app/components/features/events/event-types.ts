export enum GlobalEventType {
  ZenModeEnabled,
  ZenModeDisabled
}

export type GlobalEventListener = {
  eventType: GlobalEventType;
  callback: () => void;
  reference: number;
};

export type EventContextState = {
  registerEventListener?: (
    eventType: GlobalEventType,
    callback: () => void
  ) => number;
  unregisterEventListener?: (reference: number) => void;
  triggerEvent?: (eventType: GlobalEventType) => Promise<void>;
};
