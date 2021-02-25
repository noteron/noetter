import { useCallback, useContext } from "react";
import fs from "fs";
import path from "path";
import FilePathContext from "../../../contexts/file-path-context";
import { getFileNameWithExtension } from "../helpers/note-management-helpers";

type UseFileWriterProps = {
  saveNewFile: (
    rawFileString: string,
    suggestedFileNameWithoutExtension: string
  ) => Promise<string>;
  saveExistingFile: (
    rawFileString: string,
    suggestedFileNameWithoutExtension: string,
    oldFileNameWithoutExtension?: string
  ) => Promise<string>;
  deleteFile: (fileNameWithoutExtension: string) => Promise<void>;
};

const useFileWriter = (): UseFileWriterProps => {
  const { notesFolderPath } = useContext(FilePathContext);

  const getFreeFileName = useCallback(
    (wantedFilename: string): string => {
      const fileNames = fs.readdirSync(notesFolderPath);
      let filenameToTryWithoutExtension = wantedFilename;
      let filenamesTried = 1;
      while (
        fileNames.includes(
          getFileNameWithExtension(filenameToTryWithoutExtension)
        )
      ) {
        filenameToTryWithoutExtension = `${filenameToTryWithoutExtension} (${filenamesTried})`;
        filenamesTried += 1;
      }
      return filenameToTryWithoutExtension;
    },
    [notesFolderPath]
  );

  const saveNewFile = useCallback(
    async (
      rawFileString: string,
      suggestedFileNameWithoutExtension: string
    ): Promise<string> =>
      new Promise<string>((resolve) => {
        const freeFileName = getFreeFileName(suggestedFileNameWithoutExtension);
        const absolutePath = path.normalize(
          `${notesFolderPath}/${getFileNameWithExtension(freeFileName)}`
        );
        fs.writeFile(absolutePath, rawFileString, "utf-8", () => {
          resolve(freeFileName);
        });
      }),
    [getFreeFileName, notesFolderPath]
  );

  const saveExistingFile = useCallback(
    async (
      rawFileString: string,
      suggestedFileNameWithoutExtension: string,
      oldFileNameWithoutExtension?: string
    ): Promise<string> =>
      new Promise<string>((resolve) => {
        let absoluteNewPath = "";
        let freeFileNameWithoutExtension: string = suggestedFileNameWithoutExtension;
        if (oldFileNameWithoutExtension) {
          freeFileNameWithoutExtension = getFreeFileName(
            suggestedFileNameWithoutExtension
          );
          absoluteNewPath = path.normalize(
            `${notesFolderPath}/${getFileNameWithExtension(
              freeFileNameWithoutExtension
            )}`
          );
          const absoluteOldPath = path.normalize(
            `${notesFolderPath}/${getFileNameWithExtension(
              oldFileNameWithoutExtension
            )}`
          );
          if (fs.existsSync(absoluteOldPath))
            fs.renameSync(absoluteOldPath, absoluteNewPath);
        } else {
          absoluteNewPath = path.normalize(
            `${notesFolderPath}/${getFileNameWithExtension(
              suggestedFileNameWithoutExtension
            )}`
          );
        }
        fs.writeFile(absoluteNewPath, rawFileString, "utf-8", () => {
          resolve(freeFileNameWithoutExtension);
        });
      }),
    [getFreeFileName, notesFolderPath]
  );

  const deleteFile = useCallback(
    async (fileNameWithoutExtension: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const absolutePath = path.normalize(
          `${notesFolderPath}/${getFileNameWithExtension(
            fileNameWithoutExtension
          )}`
        );
        fs.unlink(absolutePath, () => {
          resolve();
        });
      }),
    [notesFolderPath]
  );

  return {
    saveNewFile,
    saveExistingFile,
    deleteFile
  };
};

export default useFileWriter;
