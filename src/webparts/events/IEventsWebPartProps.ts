import {IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

export interface IEventsWebPartProps {
  listName: string; //here we take listName reason:-inview more render to OOB Calender View
  eventStartDate: IDateTimeFieldValue;
  eventEndDate: IDateTimeFieldValue;
  serviceline: string;
  location: string;
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface ISPLists {
  value: ISPList[];
}
