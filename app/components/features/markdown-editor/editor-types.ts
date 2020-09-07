export type CursorPosition = {
  start: number;
  end: number;
  isSelection: boolean;
  isForwardSelection: boolean | undefined;
};

export type EditorRow = {
  index: number;
  startsAtPosition: number;
  endsAtPosition: number;
  stringValue: string;
};

export enum InsertType {
  RowStart,
  RowEnd,
  AroundSelection,
  SelectionStart,
  SelectionEnd,
  ReplaceSelection
}
