declare interface IEventDetailsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  selectedListNameFieldLabel: string;
  eventSelectDatesLabel: string;
  EnDateValidationMessage: string;
  SartDateValidationMessage: string;
  SelectedPrectices: string;
}

declare module 'EventDetailsWebPartStrings' {
  const strings: IEventDetailsWebPartStrings;
  export = strings;
}
