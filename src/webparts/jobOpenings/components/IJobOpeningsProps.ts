import { IJobOpeningsWebpartProps } from '../IJobOpeningsWebpartProps';
import { MSGraphClient } from '@microsoft/sp-http';
export interface IJobOpeningsProps extends IJobOpeningsWebpartProps {
  siteUrl: string;
  graphClient: MSGraphClient;
  currentUserEmail: string;
}


