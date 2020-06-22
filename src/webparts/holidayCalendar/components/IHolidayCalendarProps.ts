import { MSGraphClient } from '@microsoft/sp-http';
import { IHolidayCalendarWebPartProps } from '../IHolidayCalendarWebPartProps';
export interface IHolidayCalendarProps extends IHolidayCalendarWebPartProps{
  siteurl: string;
  graphClient: MSGraphClient;
}
