export interface IInsightsWebPartProps {
  listId: string;
  serviceline: string;
  location: string;
  newslistId: string;
  globalthoughtleadershiplistId: string;
  thoughtleadershiplistId: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
