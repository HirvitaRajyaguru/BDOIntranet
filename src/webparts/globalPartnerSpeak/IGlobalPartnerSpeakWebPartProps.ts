

export interface IGlobalPartnerSpeakWebPartProps {
  listId: string;
  numberOfSeconds: number;
  serviceline: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
