import { ShortcutMap, ShortcutIdentifiers } from "./types";

const shortcuts: ShortcutMap = {
  [ShortcutIdentifiers.ToggleZenMode]: {
    name: "Window: Toggle zen mode",
    keyCombination: {
      altKey: true,
      ctrlKey: true,
      key: "z"
    }
  },
  [ShortcutIdentifiers.CreateNewNote]: {
    name: "Note management: Create new note",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "n"
    }
  },
  [ShortcutIdentifiers.SaveCurrentNote]: {
    name: "Note Management: Save current note",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "s"
    }
  },
  [ShortcutIdentifiers.ToggleEditMode]: {
    name: "Editor: Toggle edit mode",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "e"
    }
  },
  [ShortcutIdentifiers.ToggleCheckbox]: {
    name: "Editor: Make row into checkbox",
    keyCombination: {
      altKey: true,
      ctrlKey: false,
      key: "d"
    }
  },
  [ShortcutIdentifiers.IncreaseFontSize]: {
    name: "Editor: Increase font size",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "+"
    }
  },
  [ShortcutIdentifiers.DecreaseFontSize]: {
    name: "Editor: Decrease font size",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "-"
    }
  }
};

export default shortcuts;
