import { createContext } from "react";
import { FileDescription } from "../hooks/use-file-reader";

export type CurrentNote = {
  fileName?: string;
  title: string;
  tags: string[];
  created: number;
  modified: number;
  markdown: string;
};

export type NoteManagementContextState = {
  currentNote?: CurrentNote;
  updateCurrentNote?: (updatedNote: CurrentNote) => void;
  selectedTags?: string[];
  selectTags?: (newTags: string[]) => void;
  openNote?: (availableNote: FileDescription) => Promise<void>;
  createNewNote?: () => void;
  saveNote?: () => Promise<void>;
  allAvailableNotes?: FileDescription[];
};

const NoteManagementContext = createContext<NoteManagementContextState>({});

export default NoteManagementContext;
