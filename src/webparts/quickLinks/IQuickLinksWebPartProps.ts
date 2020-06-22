export interface IQuickLinksWebPartProps {
  listId: string;
  practices: string;
  numberOfSeconds: number;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
