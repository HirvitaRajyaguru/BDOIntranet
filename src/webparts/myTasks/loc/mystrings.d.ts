declare interface IMyTasksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  completedRequest: string;
}

declare module 'MyTasksWebPartStrings' {
  const strings: IMyTasksWebPartStrings;
  export = strings;
}
