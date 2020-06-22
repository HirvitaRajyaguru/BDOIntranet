import { MSGraphClient } from '@microsoft/sp-http';
import { IMyTasksWebPartProps } from '../IMyTasksWebPartProps';
export interface IMyTasksProps extends IMyTasksWebPartProps{
  graphClient: MSGraphClient;
  siteUrl: string;
}
