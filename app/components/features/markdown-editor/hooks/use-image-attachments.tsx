import { useCallback, useEffect, useState, useContext } from "react";
import fs from "fs";
import path from "path";
import FilePathContext from "../../../contexts/file-path-context";

const acceptedFiles = ["image/gif", "image/png", "image/jpeg", "image/bmp"];

type UseImageAttachmentsState = {
  images: { [key: string]: string };
  transformImages: (data: DataTransfer) => void;
  clipboardContainsImage: (data: DataTransfer) => boolean;
};

type ImageToHandle = {
  filename: string;
  file: File;
};

const useImageAttachments = (): UseImageAttachmentsState => {
  const { attachmentsFolderPath } = useContext(FilePathContext);
  const [newImagesToHandle, setNewImagesToHandle] = useState<ImageToHandle[]>(
    []
  );
  const isValidFormat = useCallback(
    (fileType: string): boolean => acceptedFiles.includes(fileType),
    []
  );

  const clipboardContainsImage = useCallback(
    (data: DataTransfer): boolean => isValidFormat(data.items[0].type),
    [isValidFormat]
  );

  const transformImages = useCallback(
    async (data: DataTransfer): Promise<void> => {
      let blob: File | null = null;
      const item = data.items[0];
      if (item.type.indexOf("image") === 0) {
        blob = item.getAsFile();
      } else {
        console.log("No image in clipboard");
      }
      if (blob !== null) {
        const reader = new FileReader();
        reader.onload = (evt: any) => {
          const base64 = evt.target.result.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          const filename = `${blob?.lastModified}-${blob?.name}`;
          const absoluteFilepath = path.normalize(
            `${attachmentsFolderPath}/${filename}`
          );
          fs.writeFileSync(absoluteFilepath, base64, { encoding: "base64" });
        };
        reader.readAsDataURL(blob);
      }
      // eslint-disable-next-line no-plusplus
      // if (isValidFormat(data.items[0].type) !== false) {
      //   const blob: File | null = data.items[0].getAsFile();
      //   console.log(data);
      //   const { URL } = window;

      //   if (blob) {
      //     const filename = `${blob.lastModified}-${blob.name}`;
      //     const absoluteFilepath = path.normalize(
      //       `${attachmentsFolderPath}/${filename}`
      //     );
      //     // eslint-disable-next-line no-await-in-loop
      //     fs.writeFileSync(absoluteFilepath, blob.stream());

      //     // setNewImagesToHandle((prev: ImageToHandle[]): ImageToHandle[] => [
      //     //   ...prev,
      //     //   { filename: , file: blob }
      //     // ]);
      //     // We shouldn't fire the callback if we can't create `new Blob()`
      //     // const src = URL.createObjectURL(blob);

      //     // setImageString(src);
      //   }
      // } else {
      //   console.log(`Sorry, that's not a format we support`);
      // }
    },
    [attachmentsFolderPath]
  );

  // const handleImages = useCallback(() => {}, []);

  // useEffect(() => {
  //   if (newImagesToHandle.length) {
  //     handleImages();
  //   }
  // }, [newImagesToHandle.length]);

  return {
    images: {},
    transformImages,
    clipboardContainsImage
  };
};

export default useImageAttachments;

// take blob data with filename

// save blob data

// read file

// return list of images with filenames

// render: blob:file:///a918af3c-592e-4e34-8b05-35746db00045
