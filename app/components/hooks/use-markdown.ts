import { useMemo } from "react";
import { compiler } from "markdown-to-jsx";
import useImageAttachments from "../features/markdown-editor/hooks/use-image-attachments";

const useMarkdown = (rawMarkdown: string): JSX.Element => {
  const { replaceAttachmentPlaceholders } = useImageAttachments();
  const markdownAsJsx = useMemo<JSX.Element>(
    () => compiler(replaceAttachmentPlaceholders(rawMarkdown)),
    [rawMarkdown, replaceAttachmentPlaceholders]
  );

  return markdownAsJsx;
};

export default useMarkdown;
