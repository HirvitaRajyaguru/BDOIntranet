
export interface IAnnouncementWebPartProps {
  listId: string;
  serviceline: string;
  location: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
