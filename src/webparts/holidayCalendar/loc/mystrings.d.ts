declare interface IHolidayCalendarWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  EventListFieldLabel: string;
  HolidayListFieldLabel: string;
  eventSelectDatesLabel: string;
  EnDateValidationMessage: string;
  SartDateValidationMessage: string;
  selectedServiceLineFieldLabel: string;
  allServiceline: string;
}

declare module 'HolidayCalendarWebPartStrings' {
  const strings: IHolidayCalendarWebPartStrings;
  export = strings;
}
