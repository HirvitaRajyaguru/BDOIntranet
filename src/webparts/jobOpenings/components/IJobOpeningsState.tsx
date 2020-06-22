export interface IJobOpeningsState {

  items: [
    {
      ID: number;
      Title: string;
      JobDescription: string;
      Created: string;
      Location: [{ Label: string }],    
      ADDepartment: [{ Label: string }],
      Experience: string,
      Position: string;
      Display: string;
      Department: string;
      Email: string;
      City: string;
      DOB: string;
      JoiningDate: string;
    }
  ];
  ReqID: Number;
  isLoading: Boolean; 
}
