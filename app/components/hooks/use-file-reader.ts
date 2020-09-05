import fs from "fs";
import path from "path";
import readline from "readline";
import os from "os";
import { useCallback } from "react";

export type FileReaderReturnProps = {
  applicationPath: string;
  readFileSync: (fileName: string) => string;
  readDirectorySync: () => string[];
  readFileMetadataAsync: (fileName: string) => Promise<FileDescription>;
};

export type FileDescription = {
  fileName: string;
  title: string;
  tags: string[];
  created: number;
  modified: number;
};

const applicationPath = path.normalize(`${os.homedir()}/.notes`);

const useFileReader = (): FileReaderReturnProps => {
  const readFileSync = useCallback(
    (fileName: string): string =>
      fs.readFileSync(path.normalize(`${applicationPath}/${fileName}`), {
        encoding: "utf-8"
      }),
    []
  );

  const readDirectorySync = useCallback((): string[] => {
    if (!fs.existsSync(applicationPath)) {
      fs.mkdirSync(applicationPath);
    }
    return fs.readdirSync(applicationPath);
  }, []);

  const readFileMetadataAsync = useCallback(
    async (fileName: string): Promise<FileDescription> =>
      new Promise<FileDescription>((resolve) => {
        let readRowCount = 0;
        const rowsToRead = 5;

        const readStream = fs.createReadStream(
          path.normalize(`${applicationPath}/${fileName}`)
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
    []
  );

  return {
    applicationPath,
    readFileSync,
    readDirectorySync,
    readFileMetadataAsync
  };
};

export default useFileReader;
