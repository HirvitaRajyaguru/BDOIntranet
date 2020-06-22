declare interface IEventsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  selectedListNameFieldLabel: string;
  eventSelectDatesLabel: string;
  EnDateValidationMessage: string;
  SartDateValidationMessage: string;
  selectedServiceLineFieldLabel: string;
  selectedLocationFieldLabel: string;
  allServiceLine: string;
  allLocation: string;
}

declare module 'EventsWebPartStrings' {
  const strings: IEventsWebPartStrings;
  export = strings;
}
