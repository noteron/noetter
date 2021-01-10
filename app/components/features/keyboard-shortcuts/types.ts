export type KeyCombination = {
  ctrlKey: boolean;
  altKey: boolean;
  key: string;
};

export type Shortcut = {
  name: string;
  keyCombination: KeyCombination;
};

export enum ShortcutIdentifiers {
  ToggleEditMode = "ToggleEditMode",
  ToggleCheckbox = "ToggleCheckbox",
  IncreaseFontSize = "IncreaseFontSize",
  DecreaseFontSize = "DecreaseFontSize",
  CreateNewNote = "CreateNewNote",
  SaveCurrentNote = "SaveCurrentNote",
  ToggleZenMode = "ToggleZenMode"
}

export type ShortcutMap = {
  [K in ShortcutIdentifiers]: Shortcut;
};
