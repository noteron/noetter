import { useState, useCallback, useEffect } from "react";
import useFileReader from "./hooks/use-file-reader";
import {
  extractMarkdownFromRawFile,
  extractSelectedTags,
  updateCurrentNoteMetadata,
  transformCurrentNoteIntoRawFileString
} from "./helpers/note-management-helpers";
import { NoteManagementContextState } from "./contexts/note-management-context";
import { CurrentNote, FileDescription } from "./note-management-types";
import useFileWriter from "./hooks/use-file-writer";
import { DEFAULT_NOTE } from "./note-management-constants";

const useNoteManagement = (): NoteManagementContextState => {
  const { getFileDescriptions, readFileAsync } = useFileReader();
  const { saveExistingFile, saveNewFile } = useFileWriter();
  const [currentNote, setCurrentNote] = useState<CurrentNote>(DEFAULT_NOTE);
  const [fileList, setFileList] = useState<FileDescription[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>();
  const [refreshFileListError, setRefreshFileListError] = useState<string>();

  const openNote = useCallback(
    async (fileDescription: FileDescription): Promise<void> => {
      const rawFileContents = await readFileAsync(
        fileDescription.fileNameWithoutExtension
      );
      const markdown = extractMarkdownFromRawFile(rawFileContents);
      const newCurrentNote: CurrentNote = {
        markdown,
        fileDescription
      };
      setSelectedTags(extractSelectedTags(fileDescription.tags));
      setCurrentNote(newCurrentNote);
    },
    [readFileAsync]
  );

  const refreshFileList = useCallback(
    async (callback?: (fileDescriptions: FileDescription[]) => void) => {
      try {
        setRefreshFileListError(undefined);
        const fileDescriptions = await getFileDescriptions();
        setFileList(fileDescriptions);
        if (callback) callback(fileDescriptions);
      } catch {
        setRefreshFileListError("Could not get file list.");
      }
    },
    [getFileDescriptions]
  );

  useEffect(() => {
    if (fileList || refreshFileListError) return;
    refreshFileList((fileDescriptions: FileDescription[]) => {
      if (fileDescriptions.length) {
        openNote(fileDescriptions[0]);
        setSelectedTags(extractSelectedTags(fileDescriptions[0].tags));
      }
    });
  }, [fileList, openNote, refreshFileList, refreshFileListError]);

  const handleSaveExistingNote = useCallback(
    async (noteToSave: CurrentNote) => {
      const updatedNote = updateCurrentNoteMetadata(noteToSave);
      const fileNameWasUpdated =
        updatedNote.fileDescription.fileNameWithoutExtension !==
        noteToSave.fileDescription.fileNameWithoutExtension;
      const savedNewFileName = await saveExistingFile(
        transformCurrentNoteIntoRawFileString(updatedNote),
        updatedNote.fileDescription.fileNameWithoutExtension,
        fileNameWasUpdated
          ? noteToSave.fileDescription.fileNameWithoutExtension
          : undefined
      );
      updatedNote.fileDescription.fileNameWithoutExtension = savedNewFileName;
      updatedNote.fileDescription.fileExists = true;
      setCurrentNote(updatedNote);
      setFileList((prev: FileDescription[] | undefined) =>
        (prev ?? []).map(
          (file: FileDescription): FileDescription => {
            if (
              file.fileNameWithoutExtension ===
              noteToSave.fileDescription.fileNameWithoutExtension
            ) {
              return updatedNote.fileDescription;
            }
            return file;
          }
        )
      );
    },
    [saveExistingFile]
  );

  const handleSaveNewNote = useCallback(
    async (noteToSave: CurrentNote) => {
      const updatedNote = updateCurrentNoteMetadata(noteToSave);
      const savedFileName = await saveNewFile(
        transformCurrentNoteIntoRawFileString(updatedNote),
        updatedNote.fileDescription.fileNameWithoutExtension
      );
      updatedNote.fileDescription.fileNameWithoutExtension = savedFileName;
      updatedNote.fileDescription.fileExists = true;
      setCurrentNote(updatedNote);
      refreshFileList();
    },
    [refreshFileList, saveNewFile]
  );

  const saveNote = useCallback(async () => {
    if (currentNote.fileDescription.fileExists) {
      handleSaveExistingNote(currentNote);
      return;
    }
    handleSaveNewNote(currentNote);
  }, [currentNote, handleSaveExistingNote, handleSaveNewNote]);

  const createNewNote = useCallback(async (): Promise<void> => {
    const newNote = DEFAULT_NOTE;
    await handleSaveNewNote(newNote);
    setSelectedTags(extractSelectedTags(newNote.fileDescription.tags));
  }, [handleSaveNewNote]);

  const selectTags = useCallback(
    (newTags: string[]) => setSelectedTags(newTags),
    []
  );

  const updateCurrentNote = useCallback(
    (updatedNote: CurrentNote) => setCurrentNote(updatedNote),
    []
  );

  return {
    saveNote,
    allAvailableNotes: fileList,
    currentNote,
    updateCurrentNote,
    openNote,
    selectedTags,
    selectTags,
    createNewNote
  };
};

export default useNoteManagement;