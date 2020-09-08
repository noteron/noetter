import { useState, useCallback } from "react";
import {
  NoteManagementContextState,
  CurrentNote
} from "../../../contexts/note-management-context";
// import useFileReader from "../../../hooks/use-file-reader";
import useFileWriter, {
  DEFAULT_FILE_NAME
} from "../../../hooks/use-file-writer";

const defaultNote: CurrentNote = {
  created: Date.now(),
  modified: Date.now(),
  tags: ["Untagged"],
  title: "Untitled",
  markdown: "# Untitled"
};

const attachMetadataToNote = (currentNote: CurrentNote): string =>
  `---\ntitle: ${currentNote.title}\ntags: [${currentNote.tags.join(
    ", "
  )}]\ncreated: ${currentNote.created}\nmodified: ${
    currentNote.modified
  }\n---\n\n${currentNote.markdown}`;

const useNoteManagement = (): NoteManagementContextState => {
  // const { getFileDescriptions, readFileAsync } = useFileReader();
  const { saveExistingFile, saveNewFile } = useFileWriter();
  const [currentNote, setCurrentNote] = useState<CurrentNote>(defaultNote);

  const saveNote = useCallback(async () => {
    if (currentNote.fileName) {
      saveExistingFile(
        attachMetadataToNote(currentNote),
        currentNote.fileName ?? DEFAULT_FILE_NAME
      );
      return;
    }
    const fileName = await saveNewFile(attachMetadataToNote(currentNote));
    setCurrentNote((prev: CurrentNote): CurrentNote => ({ ...prev, fileName }));
  }, []);
  return {};
};

export default useNoteManagement;
