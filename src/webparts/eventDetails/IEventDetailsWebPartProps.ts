import {DateConvention, TimeConvention, IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

export interface IEventDetailsWebPartProps {
  listId: string;
  eventStartDate: IDateTimeFieldValue;
  eventEndDate: IDateTimeFieldValue;
  Practices: boolean;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
