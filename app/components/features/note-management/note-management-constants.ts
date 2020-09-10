import { CurrentNote } from "./note-management-types";

export const MAIN_TITLE_REGEX = /(\n)*# .+/;

export const DEFAULT_FILE_NAME_WITHOUT_EXTENSION = "Untitled";

export const DEFAULT_NOTE: CurrentNote = {
  markdown: "# Untitled",
  fileDescription: {
    created: Date.now(),
    modified: Date.now(),
    tags: ["Untagged"],
    title: "Untitled",
    fileNameWithoutExtension: "Untitled",
    fileExists: false
  }
};
