import { useCallback, useContext } from "react";
import fs from "fs";
import path from "path";
import FilePathContext from "../../../contexts/file-path-context";
import {
  ATTACHMENT_PLACEHOLDER,
  IMAGE_LINK_SELECTOR_REGEX,
  IMAGE_LINK_PATH_SELECTOR_REGEX
} from "../editor-constants";

const acceptedFiles = ["image/gif", "image/png", "image/jpeg", "image/bmp"];

type UseImageAttachmentsState = {
  saveImageFromClipboard: (event: ClipboardEvent) => Promise<string>;
  replaceAttachmentPlaceholders: (markdown: string) => string;
};

const useImageAttachments = (): UseImageAttachmentsState => {
  const { attachmentsFolderPath } = useContext(FilePathContext);
  const isValidFormat = useCallback(
    (fileType: string): boolean => acceptedFiles.includes(fileType),
    []
  );

  const clipboardContainsImage = useCallback(
    (data: DataTransfer): boolean => isValidFormat(data.items[0].type),
    [isValidFormat]
  );

  const saveImageFromClipboard = useCallback(
    async (event: ClipboardEvent): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        if (
          !event.clipboardData ||
          event.clipboardData.items.length === 0 ||
          !clipboardContainsImage(event.clipboardData)
        ) {
          return;
        }
        const data = event.clipboardData;
        let blob: File | null = null;
        const item = data.items[0];
        if (item.type.indexOf("image") !== 0) return;
        blob = item.getAsFile();
        if (blob !== null) {
          const reader = new FileReader();
          reader.onload = (evt: ProgressEvent<FileReader>) => {
            const base64 = (evt.target?.result as string)?.replace(
              /^data:image\/\w+;base64,/,
              ""
            );
            const filename = `${blob?.lastModified}-${blob?.name}`;
            const absoluteFilepath = path.normalize(
              `${attachmentsFolderPath}/${filename}`
            );
            fs.writeFileSync(absoluteFilepath, base64, { encoding: "base64" });
            resolve(`![](${ATTACHMENT_PLACEHOLDER}/${filename})`);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }
      }),
    [attachmentsFolderPath, clipboardContainsImage]
  );

  const replaceAttachmentPlaceholders = useCallback(
    (markdown: string): string => {
      let markdownToRender: string = markdown;
      while (markdownToRender.match(IMAGE_LINK_SELECTOR_REGEX)) {
        markdownToRender = markdownToRender.replace(
          IMAGE_LINK_SELECTOR_REGEX,
          (imageLink: string): string =>
            imageLink.replace(
              IMAGE_LINK_PATH_SELECTOR_REGEX,
              (imageLinkPath: string): string =>
                path.normalize(
                  imageLinkPath.replace(
                    ATTACHMENT_PLACEHOLDER,
                    attachmentsFolderPath
                  )
                )
            )
        );
      }
      return markdownToRender;
    },
    [attachmentsFolderPath]
  );

  return {
    saveImageFromClipboard,
    replaceAttachmentPlaceholders
  };
};

export default useImageAttachments;
