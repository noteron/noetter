import { createContext } from "react";
import { CurrentNote, FileDescription } from "../note-management-types";

export type NoteManagementContextState = {
  currentNote?: CurrentNote;
  updateCurrentNote?: (updatedNote: CurrentNote) => void;
  updateTags?: (newTags: string[]) => void;
  selectedTags?: string[];
  selectTags?: (newTags: string[]) => void;
  openNote?: (availableNote: FileDescription) => Promise<void>;
  createNewNote?: () => void;
  saveNote?: () => Promise<void>;
  allAvailableNotes?: FileDescription[];
  deleteCurrentNote?: () => Promise<void>;
};

const NoteManagementContext = createContext<NoteManagementContextState>({});

export default NoteManagementContext;
