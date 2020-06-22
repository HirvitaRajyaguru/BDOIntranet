import { MSGraphClient } from '@microsoft/sp-http';
import { IStarPerformersWebPartProps } from '../IStarPerformersWebPartProps';

export interface IStarPerformersProps extends IStarPerformersWebPartProps{
  siteUrl: string;
  graphClient: MSGraphClient;
}
