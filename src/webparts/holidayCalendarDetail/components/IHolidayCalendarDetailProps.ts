import { IHolidayCalendarDetailWebPartProps } from '../IHolidayCalendarDetailWebPartProps';
import { MSGraphClient } from '@microsoft/sp-http';
export interface IHolidayCalendarDetailProps extends IHolidayCalendarDetailWebPartProps{
  siteUrl: string;
  graphClient: MSGraphClient;
}
