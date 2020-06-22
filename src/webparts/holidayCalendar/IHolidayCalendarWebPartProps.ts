import { IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
export interface IHolidayCalendarWebPartProps {
  holidaylistId: string;
  eventlistId: string;
  eventStartDate: IDateTimeFieldValue;
  eventEndDate: IDateTimeFieldValue;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
