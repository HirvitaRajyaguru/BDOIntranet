import { SPHttpClient } from '@microsoft/sp-http';
import { IEventsWebPartProps } from '../IEventsWebPartProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IEventsProps extends IEventsWebPartProps {
  isWorkbench: boolean;
  siteUrl: string;
  spHttpClient: SPHttpClient;
  graphClient: MSGraphClient;
}
