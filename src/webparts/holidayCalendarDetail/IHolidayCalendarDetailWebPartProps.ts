export interface IHolidayCalendarDetailWebPartProps {
  listId: string;
  searchQuery: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
