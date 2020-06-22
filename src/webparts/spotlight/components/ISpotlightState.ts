export interface ISpotlightState {
  isLoading: boolean;
  items: [
    {
      EmployeeName: {
        EMail: string,
        FirstName: string,
        LastName: string,
        JobTitle: string
      };
      MediaHouse: string;
      ID: number;
      Description: string;
      PublishDate: Date;
    }
  ];
}

