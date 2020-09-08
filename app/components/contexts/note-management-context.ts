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
  createNewNote?: () => void;
  saveNote?: () => Promise<void>;
  AllNotes?: FileDescription[];
};

const NoteManagementContext = createContext<NoteManagementContextState>({});

export default NoteManagementContext;
