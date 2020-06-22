export interface IBirthdaysWebPartProps {
  listId: string;
  serviceline: string;
  location: string;
  rewardlistId: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
