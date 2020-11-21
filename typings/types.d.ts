interface IconDir {
  type: "directory";
  name: string;
  fullPath: string;
  contents: IconRecord[];
}

interface IconFile extends IconDir {
  type: "file";
  id: string;
  contents: string;
}

type IconRecord = IconDir | IconFile;

// Stores
type IconTree = IconRecord[];

type IconDict = Map<string, IconRecord>;

interface PathsSelected {
  select: (iconRecord: IconRecord, iconDict: IconDict) => void;
  clear: () => void;
}

type $PathsSelected = Set<string>;
