import { useState, useCallback, useContext } from "react";
import FilePathContext from "../contexts/file-path-context";

export type UseSettingsReturnProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  rootFolderPath: string;
};

const useSettings = (): UseSettingsReturnProps => {
  const [open, setOpen] = useState<boolean>(false);
  const { rootFolderPath } = useContext(FilePathContext);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return {
    open,
    onOpen,
    onClose,
    rootFolderPath
  };
};

export default useSettings;
