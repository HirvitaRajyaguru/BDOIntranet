export interface ISpotlightWebPartProps {
  listId: string;
  numberOfSeconds: number;
  location: string;
  serviceline: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
