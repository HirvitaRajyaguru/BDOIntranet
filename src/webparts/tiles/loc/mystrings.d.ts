declare interface ITilesWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  NumberOfDocumentsFieldLabel: string;
  selectedListNameFieldLabel: string;
}

declare module 'TilesWebPartStrings' {
  const strings: ITilesWebPartStrings;
  export = strings;
}
