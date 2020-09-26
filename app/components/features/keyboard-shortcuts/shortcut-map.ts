import { GlobalEventType } from "../events/event-types";
import { Shortcut } from "./types";

const shortcutMap: Shortcut[] = [
  {
    name: "Window: Toggle zen mode",
    keyCombination: {
      altKey: true,
      ctrlKey: true,
      key: "z"
    },
    eventType: GlobalEventType.WindowZenModeShortcutTrigger
  },
  {
    name: "Note management: Create new note",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "n"
    },
    eventType: GlobalEventType.NoteManagementCreateNewNoteTrigger
  },
  {
    name: "Note Management: Save current note",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "s"
    },
    eventType: GlobalEventType.NoteManagementSaveCurrentNoteTrigger
  },
  {
    name: "Editor: Toggle edit mode",
    keyCombination: {
      altKey: false,
      ctrlKey: true,
      key: "e"
    },
    eventType: GlobalEventType.EditorToggleEditModeTrigger
  },
  {
    name: "Editor: Make row into checkbox",
    keyCombination: {
      altKey: true,
      ctrlKey: false,
      key: "d"
    },
    eventType: GlobalEventType.EditorMakeRowIntoCheckboxTrigger
  }
];

export default shortcutMap;
