export interface IInsightsState {
  isLoading: boolean;

 
  items: [{
    "AlertDate": Date,
    "Title": string,
    "Description": string,
    "ID":number,
    "Type": string,
    "List": string,
    "SearchString":string,
    AttachmentFiles: [{
      ServerRelativeUrl: string
    }];
  }];
}
