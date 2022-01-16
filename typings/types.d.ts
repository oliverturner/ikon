export interface IconDir {
  type: "directory";
  name: string;
  fullPath: string;
  contents: IconRecord[];
}

export interface IconFile extends IconDir {
  type: "file";
  id: string;
  contents: string;
}

export type IconRecord = IconDir | IconFile;

// Stores
export type IconTree = IconRecord[];

export type IconDict = Map<string, IconRecord>;

// export as namespace Ikon;
