import { CurrentNote } from "../note-management-types";
import { MAIN_TITLE_REGEX, DEFAULT_NOTE } from "../note-management-constants";

export const extractMarkdownFromRawFile = (fileContents: string): string => {
  const metaStartEndIndicator = "---\n";
  const positionOfIndicatorForMetaStart = fileContents.indexOf(
    metaStartEndIndicator
  );
  const positionOfIndicatorForMetaEnd =
    fileContents.indexOf(
      metaStartEndIndicator,
      positionOfIndicatorForMetaStart + metaStartEndIndicator.length
    ) + metaStartEndIndicator.length;
  const numberOfLineBreaksBetweenMetaAndMarkdown = 1;
  const markdown = fileContents.slice(
    positionOfIndicatorForMetaEnd + numberOfLineBreaksBetweenMetaAndMarkdown
  );
  return markdown;
};

export const extractSelectedTags = (tags?: string[]): string[] =>
  tags?.[0]?.split("/") ?? [];

export const extractTitleFromMarkdownMainTitle = (
  currentNote: CurrentNote
): string =>
  currentNote.markdown
    .match(MAIN_TITLE_REGEX)?.[0]
    .replace("# ", "")
    .replaceAll("\n", "") ?? DEFAULT_NOTE.fileDescription.title;

export const extractFileNameFromMarkdownMainTitle = (
  rawFileString: string
): string =>
  `${
    rawFileString
      .match(MAIN_TITLE_REGEX)?.[0]
      ?.replace("# ", "")
      .replaceAll(" ", "_")
      .replaceAll("\n", "") ??
    DEFAULT_NOTE.fileDescription.fileNameWithoutExtension
  }`;

export const updateCurrentNoteMetadata = (
  currentNote: CurrentNote
): CurrentNote => ({
  ...currentNote,
  fileDescription: {
    ...currentNote.fileDescription,
    title: extractTitleFromMarkdownMainTitle(currentNote),
    fileNameWithoutExtension: extractFileNameFromMarkdownMainTitle(
      currentNote.markdown
    )
  }
});

export const transformCurrentNoteIntoRawFileString = (
  currentNote: CurrentNote
): string =>
  `---\ntitle: ${
    currentNote.fileDescription.title
  }\ntags: [${currentNote.fileDescription.tags.join(", ")}]\ncreated: ${
    currentNote.fileDescription.created
  }\nmodified: ${currentNote.fileDescription.modified}\n---\n\n${
    currentNote.markdown
  }`;

export const getFileNameWithExtension = (
  filenameWithoutExtension: string
): string => `${filenameWithoutExtension}.md`;

export const getFileNameWithoutExtension = (fileName: string): string =>
  fileName.replace(".md", "");
