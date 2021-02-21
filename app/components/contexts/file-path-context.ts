import { createContext } from "react";
import path from "path";
import os from "os";

type FilePathContextState = {
  rootFolderPath: string;
  attachmentsFolderPath: string;
  notesFolderPath: string;
};

const FilePathContext = createContext<FilePathContextState>({
  rootFolderPath: path.normalize(`${os.homedir()}/.noetter`),
  notesFolderPath: path.normalize(`${os.homedir()}/.noetter/notes`),
  attachmentsFolderPath: path.normalize(`${os.homedir()}/.noetter/attachments`)
});

export default FilePathContext;
