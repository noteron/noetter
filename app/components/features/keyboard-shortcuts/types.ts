import { GlobalEventType } from "../events/event-types";

export type KeyCombination = {
  ctrlKey: boolean;
  altKey: boolean;
  key: string;
};

export type Shortcut = {
  name: string;
  keyCombination: KeyCombination;
  eventType: GlobalEventType;
};
