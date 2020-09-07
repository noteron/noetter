import { useMemo, useEffect, useContext } from "react";
import fs from "fs";
import FilePathContext from "../contexts/file-path-context";

const useDirectoryInitialization = () => {
  const { attachmentsFolderPath, notesFolderPath, rootFolderPath } = useContext(
    FilePathContext
  );

  useEffect(() => {
    if (!fs.existsSync(rootFolderPath)) {
      fs.mkdirSync(rootFolderPath);
    }
    if (!fs.existsSync(notesFolderPath)) {
      fs.mkdirSync(notesFolderPath);
    }
    if (!fs.existsSync(attachmentsFolderPath)) {
      fs.mkdirSync(attachmentsFolderPath);
    }
  }, [attachmentsFolderPath, notesFolderPath, rootFolderPath]);
};

export default useDirectoryInitialization;
