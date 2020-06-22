export interface IQuickLinksState {
  listData: IlinkDataItem[];
  //items: [
  //  {
  //    Title: string;
  //    ImageUrl: string;
  //    Description: string;
  //    LinkUrl: string;
  //  }
  //]
}


export interface IlinkDataItem {
  Title: string;
  ImageUrl: string;
  Description: string;
  LinkUrl: string;
}
