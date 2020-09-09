import { useState, useCallback, useEffect } from "react";
import {
  NoteManagementContextState,
  CurrentNote
} from "../contexts/note-management-context";
import useFileWriter, {
  DEFAULT_FILE_NAME,
  MAIN_TITLE_REGEX
} from "./use-file-writer";
import useFileReader, { FileDescription } from "./use-file-reader";

const defaultNote: CurrentNote = {
  created: Date.now(),
  modified: Date.now(),
  tags: ["Untagged"],
  title: "Untitled",
  markdown: "# Untitled"
};

const extractMarkdownFromRawFile = (fileContents: string): string => {
  const metaStartEndIndicator = "---\n";
  const positionOfIndicatorForMetaStart = fileContents.indexOf(
    metaStartEndIndicator
  );
  const positionOfIndicatorForMetaEnd =
    fileContents.indexOf(
      metaStartEndIndicator,
      positionOfIndicatorForMetaStart + metaStartEndIndicator.length
    ) + metaStartEndIndicator.length;

  const markdown = fileContents.slice(positionOfIndicatorForMetaEnd);
  return markdown;
};

const extractSelectedTags = (tags?: string[]): string[] =>
  tags?.[0].split("/") ?? [];

const extractUpdatedTitleFromMarkdown = (currentNote: CurrentNote): string =>
  currentNote.markdown.match(MAIN_TITLE_REGEX)?.input?.replace("#", "") ??
  currentNote.title;

const updateCurrentNoteMetadata = (currentNote: CurrentNote): CurrentNote => ({
  ...currentNote,
  title: extractUpdatedTitleFromMarkdown(currentNote)
});

const attachMetadataToNote = (currentNote: CurrentNote): string =>
  `---\ntitle: ${currentNote.title}\ntags: [${currentNote.tags.join(
    ", "
  )}]\ncreated: ${currentNote.created}\nmodified: ${
    currentNote.modified
  }\n---\n\n${currentNote.markdown}`;

const useNoteManagement = (): NoteManagementContextState => {
  const { getFileDescriptions, readFileAsync } = useFileReader();
  const { saveExistingFile, saveNewFile } = useFileWriter();
  const [currentNote, setCurrentNote] = useState<CurrentNote>(defaultNote);
  const [fileList, setFileList] = useState<FileDescription[]>();
  const [selectedTags, setSelectedTags] = useState<string[]>();
  const [refreshFileListError, setRefreshFileListError] = useState<string>();

  const openNote = useCallback(
    async (fileDescription: FileDescription): Promise<void> => {
      const rawFileContents = await readFileAsync(fileDescription.fileName);
      const markdown = extractMarkdownFromRawFile(rawFileContents);
      const newCurrentNote: CurrentNote = {
        fileName: fileDescription.fileName,
        created: fileDescription.created,
        modified: fileDescription.modified,
        tags: fileDescription.tags,
        title: fileDescription.title,
        markdown
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

  const handleSaveExistingNote = useCallback(async () => {
    const updatedNote = updateCurrentNoteMetadata(currentNote);
    await saveExistingFile(
      attachMetadataToNote(updatedNote),
      updatedNote.fileName ?? DEFAULT_FILE_NAME
    );
    setCurrentNote(updatedNote);
    setFileList((prev: FileDescription[] | undefined) =>
      (prev ?? []).map(
        (file: FileDescription): FileDescription => {
          if (file.fileName === updatedNote.fileName) {
            return {
              ...file,
              title: updatedNote.title,
              created: updatedNote.created,
              modified: updatedNote.modified,
              tags: updatedNote.tags
            };
          }
          return file;
        }
      )
    );
  }, [currentNote, saveExistingFile]);

  const handleSaveNewNote = useCallback(async () => {
    const updatedNote = updateCurrentNoteMetadata(currentNote);
    const fileName = await saveNewFile(attachMetadataToNote(updatedNote));
    setCurrentNote({ ...updatedNote, fileName });
    refreshFileList();
  }, [currentNote, refreshFileList, saveNewFile]);

  const saveNote = useCallback(async () => {
    if (currentNote.fileName) {
      handleSaveExistingNote();
      return;
    }
    handleSaveNewNote();
  }, [currentNote.fileName, handleSaveExistingNote, handleSaveNewNote]);

  const createNewNote = useCallback((): void => {
    setCurrentNote(defaultNote);
    setSelectedTags(extractSelectedTags(defaultNote.tags));
  }, []);

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
