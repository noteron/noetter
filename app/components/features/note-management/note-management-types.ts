export type CurrentNote = {
  markdown: string;
  fileDescription: FileDescription;
};

export type FileDescription = {
  fileNameWithoutExtension: string;
  title: string;
  tags: string[];
  created: number;
  modified: number;
  fileExists: boolean;
};
