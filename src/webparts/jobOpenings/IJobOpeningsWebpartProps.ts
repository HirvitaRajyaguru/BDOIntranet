export interface IJobOpeningsWebpartProps {
  listId: string;
  serviceline: string;
  location: string;
  newjoineelistId: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
