export interface IKeyDocumentsState {
  items: [
    {
      File: {
        Name: string;
        LinkingUri: string;
        // FileRef: string;
        File_x0020_Type: string;
      },
      File_x0020_Type: string;
      HeadLine: string;
      RespectivePageLink: {
        url: string;
      }
    }
  ];
}
