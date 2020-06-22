
import { IData } from './IData';

export interface IHolidayCalendarState {
  isLoading: boolean;
  data: IData[];
  items: [
    {

     
      Title: string;
      Location: string;
      EventDate: Date;  //Start Time
      EndDate: Date;
      Description?: any;
      Duration?: number;
      ownerInitial?: string;
      ownerPhoto?: string;
      ownerEmail?: string;
      ownerName?: string;
      Id?: number;
      ID?: number;
      color?: string;
      fAllDayEvent?: boolean;
      geolocation?: { Longitude: number, Latitude: number };
      Category?: string;
      RecurrenceData?: string;
      fRecurrence?: string | boolean;
      EventType?: string;
      UID?: string;
      RecurrenceID?: string;
      MasterSeriesItemID?: string;
    }
  ];
}
