import { MSGraphClient } from '@microsoft/sp-http';
import { IInsightsWebPartProps } from '../IInsightsWebPartProps';

export interface IInsightsProps extends IInsightsWebPartProps{
  siteurl: string;
  graphClient: MSGraphClient;
}
