export interface IHolidayCalendarDetailState {
  isLoading: boolean;
  items: [
    {
      Title: string;
      Location: string;
      DateOfHoliday: string;
    }
  ];
}
