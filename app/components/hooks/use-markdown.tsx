import { useMemo } from "react";
import { compiler } from "markdown-to-jsx";

const useMarkdown = (rawMarkdown: string): JSX.Element => {
  const markdownAsJsx = useMemo<JSX.Element>(() => compiler(rawMarkdown), [
    rawMarkdown
  ]);

  return markdownAsJsx;
};

export default useMarkdown;
