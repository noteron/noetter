import { useCallback, useContext } from "react";
import fs from "fs";
import path from "path";
import FilePathContext from "../contexts/file-path-context";

const MAIN_TITLE_REGEX = /^# .+/;
export const DEFAULT_FILE_NAME = "Untitled";

type UseFileWriterProps = {
  saveNewFile: (markdown: string) => Promise<string>;
  saveExistingFile: (markdown: string, filename: string) => Promise<void>;
};

const useFileWriter = (): UseFileWriterProps => {
  const { notesFolderPath } = useContext(FilePathContext);

  const getFreeFilename = useCallback(
    (wantedFilename: string): string => {
      const fileNames = fs.readdirSync(notesFolderPath);
      let filenameToTry = `${wantedFilename}.md`;
      let filenamesTried = 1;
      while (fileNames.includes(filenameToTry)) {
        filenameToTry = `${filenameToTry} (${filenamesTried}).md`;
        filenamesTried += 1;
      }
      return filenameToTry;
    },
    [notesFolderPath]
  );

  const saveNewFile = useCallback(
    async (markdown: string): Promise<string> =>
      new Promise<string>((resolve) => {
        const filename = getFreeFilename(
          `${
            markdown
              .match(MAIN_TITLE_REGEX)
              ?.input?.replace("#", "")
              .replace(" ", "") ?? DEFAULT_FILE_NAME
          }`
        );
        const absolutePath = path.normalize(`${notesFolderPath}/${filename}`);
        fs.writeFile(absolutePath, markdown, "utf-8", () => {
          resolve(filename);
        });
      }),
    [getFreeFilename, notesFolderPath]
  );

  const saveExistingFile = useCallback(
    async (markdown: string, filename: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const absolutePath = path.normalize(`${notesFolderPath}/${filename}`);
        fs.writeFile(absolutePath, markdown, "utf-8", () => {
          resolve();
        });
      }),
    [notesFolderPath]
  );

  return {
    saveNewFile,
    saveExistingFile
  };
};

export default useFileWriter;
