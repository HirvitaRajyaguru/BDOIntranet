export interface IEventDetailsState {
  isLoading: boolean;
  items: [
    {
      EventOwner: {
        JobTitle: string,
        FirstName: string,
        LastName: string

      },
      Location: string,
      Title: string,
      EventDate: Date,
      EndDate: Date
    }];
}
