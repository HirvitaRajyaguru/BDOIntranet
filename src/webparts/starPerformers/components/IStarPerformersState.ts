export interface IStarPerformersState {
  items: [
    {
      EmployeeName: {
        EMail: string,
        FirstName: string,
        LastName: string
      },
      AwardType: string;
      AwardDate: string;
    }
  ];
  isLoading: boolean;
}
