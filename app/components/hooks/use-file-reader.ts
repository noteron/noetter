import fs from "fs";
import path from "path";
import readline from "readline";
import { useCallback, useContext } from "react";
import FilePathContext from "../contexts/file-path-context";

export type FileReaderReturnProps = {
  readFileAsync: (fileName: string) => Promise<string>;
  getFileDescriptions: () => Promise<FileDescription[]>;
};

export type FileDescription = {
  fileName: string;
  title: string;
  tags: string[];
  created: number;
  modified: number;
};

const useFileReader = (): FileReaderReturnProps => {
  const { rootFolderPath } = useContext(FilePathContext);
  const readFileAsync = useCallback(
    async (fileName: string): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        fs.readFile(
          path.normalize(`${rootFolderPath}/${fileName}`),
          {
            encoding: "utf-8"
          },
          (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(data);
          }
        );
      }),
    [rootFolderPath]
  );

  const readDirectorySync = useCallback(
    (): string[] => fs.readdirSync(rootFolderPath),
    [rootFolderPath]
  );

  const readFileMetadataAsync = useCallback(
    async (fileName: string): Promise<FileDescription> =>
      new Promise<FileDescription>((resolve) => {
        let readRowCount = 0;
        const rowsToRead = 5;

        const readStream = fs.createReadStream(
          path.normalize(`${rootFolderPath}/${fileName}`)
        );
        const reader = readline.createInterface({
          input: readStream
        });
        let title = "";
        let tags: string[] = [];
        let created: number;
        let modified: number;

        reader.on("line", (line: string) => {
          readRowCount += 1;
          // TODO: Prevent reader from reading entire file if possible
          // console.log(
          //   "reader.on(line) callback, read rows: ",
          //   readRowCount
          // );

          if (line.startsWith("tags: ")) {
            tags = line.replace("tags: [", "").replaceAll("]", "").split(",");
          }
          if (line.startsWith("title: ")) {
            title = line.replace("title: ", "");
          }
          if (line.startsWith("created: ")) {
            created = Date.parse(
              line.replace("created: ", "").replaceAll("'", "")
            );
          }
          if (line.startsWith("modified: ")) {
            modified = Date.parse(
              line.replace("modified: ", "").replaceAll("'", "")
            );
          }

          if (readRowCount === rowsToRead) {
            reader.close();
            readStream.destroy();
            resolve({
              fileName,
              title,
              tags,
              created,
              modified
            });
          }
        });
      }),
    [rootFolderPath]
  );

  const getFileDescriptions = useCallback(async (): Promise<
    FileDescription[]
  > => {
    const folderContent = readDirectorySync();
    const filesWithMetadata = await Promise.all(
      folderContent.map(readFileMetadataAsync)
    );

    return filesWithMetadata;
  }, [readDirectorySync, readFileMetadataAsync]);

  return {
    readFileAsync,
    getFileDescriptions
  };
};

export default useFileReader;
