export interface IUploadJobResumeState {
  items: [
    {
      Title: string;
      Description: string;
      Experience: string;
      Id: number;
      Location: [{ Label: string }],
      ADDepartment: [{ Label: string }],
    }
  ];

  Candidatename: string;
  ContactNo: number;
  Email: string;
  WorkExperience: number;
  WorkwithBDO: string;
  required: any;

  errors: any;

  Success: string;
  popupOpened?: boolean;
  hideDialog: boolean;
}
