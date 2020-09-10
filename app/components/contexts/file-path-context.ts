import { createContext } from "react";
import path from "path";
import os from "os";

type FilePathContextState = {
  rootFolderPath: string;
  attachmentsFolderPath: string;
  notesFolderPath: string;
};

const FilePathContext = createContext<FilePathContextState>({
  rootFolderPath: path.normalize(`${os.homedir()}/.notes`),
  notesFolderPath: path.normalize(`${os.homedir()}/.notes/notes`),
  attachmentsFolderPath: path.normalize(`${os.homedir()}/.notes/attachments`)
});

export default FilePathContext;
