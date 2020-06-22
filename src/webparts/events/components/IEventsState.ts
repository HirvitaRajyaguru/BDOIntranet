export interface IEventsState {
  isLoading: boolean;
  items: [
    {
      EventOwner: {
       
        FirstName: string,
        LastName: string
      },
      LocationAD: [{ Label: string }],
      ADDepartment:[{ Label: string }],
      Title: string,
      ID:number,
      EventDate: string,  //Start Time
      EndDate: Date //End Time
    }];
}
