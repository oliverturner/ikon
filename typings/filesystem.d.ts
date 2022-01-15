// Types based on MDN docs:
// FileSystemEntry: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
// FileSystemFileEntry: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
// FileSystemDirectoryEntry: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry

export type FileSystem = {
  // A USVString representing the file system's name. This name is unique among the entire list of exposed file systems.
  name: string;

  // A FileSystemDirectoryEntry object which represents the file system's root directory. Through this object, you can gain access to all files and directories in the file system.
  root: FileSystemDirectoryEntry;
};

export type FileSystemEntry = {
  // A FileSystem object representing the file system in which the entry is located.
  filesystem: FileSystem;

  // A USVString object which provides the full, absolute path from the file system's root to the entry; it can also be thought of as a path which is relative to the root directory, prepended with a "/" character.
  fullPath: string;

  // A Boolean which is true if the entry represents a directory; otherwise, it's false.
  isDirectory: boolean;

  // A Boolean which is true if the entry represents a file. If it's not a file, this value is false.
  isFile: boolean;

  // A USVString containing the name of the entry (the final part of the path, after the last "/" character).
  name: string;

  // Copies the file or directory to a new location on the file system.
  copyTo: () => void;

  // Obtains metadata about the file, such as its modification date and size.
  getMetadata: () => unknown;

  // Returns a FileSystemDirectoryEntry representing the entry's parent directory.
  getParent: () => FileSystemDirectoryEntry;

  // Moves the file or directory to a new location on the file system, or renames the file or directory.
  moveTo: () => void;

  // Removes the specified file or directory. You can only remove directories which are empty.
  remove: () => void;

  // Creates and returns a URL which identifies the entry. This URL uses the URL scheme "filesystem:".
  toURL: () => URL;
};

export type FileSystemFileEntry = FileSystemEntry & {
  file: (
    successCallback: (value: Blob) => void,
    errorCallback?: (reason?: any) => void
  ) => File;
};

export type FileSystemDirectoryEntry = FileSystemEntry & {
  createReader: () => FileSystemDirectoryReader;
};

export type FileSystemDirectoryReader = {
  readEntries: (
    successCallback: (value?: FileSystemEntry[]) => void,
    errorCallback?: (reason?: any) => void
  ) => Promise<FileSystemEntry[]>;
};
