declare interface IInsightsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  selectedListNameFieldLabel: string;
  selectedNewsListNameFieldLabel: string;
  selectedTLListNameFieldLabel: string;
  selectedGTLListNameFieldLabel: string;
  selectedServiceLineFieldLabel: string;
  selectedLocationFieldLabel: string;
  allServiceLine: string;
  allLocation: string;
  TypeInsights: string;
  TypeNewsletter: string;
  TypeGlobalThought: string;
  TypeThought: string;
  SearchThought: string;
  SearchInsights: string;
  SearchNewsletter: string;
  SearchGlobalThought: string;
  TypeTiffin: string;
  SearchTiffin: string; 
  
}

declare module 'InsightsWebPartStrings' {
  const strings: IInsightsWebPartStrings;
  export = strings;
}
