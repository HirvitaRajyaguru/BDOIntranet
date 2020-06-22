export interface IStarPerformersWebPartProps {
  listId: string;
  IsImage: boolean;
  Homepage: boolean;
  serviceline: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
