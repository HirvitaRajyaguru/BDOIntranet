declare interface ISpotlightWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  selectedListNameFieldLabel: string;
  NumberOfSecondFieldLabel: string;
  Homepage: string;
  selectedServiceLineFieldLabel: string;
  allServiceLine: string;
  allLocation: string;
  selectedLocationFieldLabel: string;
  searchString: string;
}

declare module 'SpotlightWebPartStrings' {
  const strings: ISpotlightWebPartStrings;
  export = strings;
}
