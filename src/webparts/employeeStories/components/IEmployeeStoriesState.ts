export interface IEmployeeStoriesState {
  image: [{
    ServerRelativeUrl: string
  }];

  items: [
    {
      ID: number;
      Title: string;
      Description: string;
      AttachmentFiles: [{
        ServerRelativeUrl: string
      }];
      EmployeeName: { FirstName: string, LastName: string };
      ADDepartment: [{ Label: string }]
      Location: [{ Label: string }]
    }
  ];
  ReqID: Number;
  isLoading: boolean;
}
