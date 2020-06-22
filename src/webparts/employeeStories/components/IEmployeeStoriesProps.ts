

import { MSGraphClient } from '@microsoft/sp-http';
import { IEmployeeStoriesWebPartProps } from '../IEmployeeStoriesWebPartProps';

export interface IEmployeeStoriesProps extends IEmployeeStoriesWebPartProps {
  siteUrl: string;
  graphClient: MSGraphClient;
}
