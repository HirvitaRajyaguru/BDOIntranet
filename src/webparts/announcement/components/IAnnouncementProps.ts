import { MSGraphClient } from '@microsoft/sp-http';
import { IAnnouncementWebPartProps } from '../IAnnouncementWebPartProps';

export interface IAnnouncementProps extends IAnnouncementWebPartProps {
  siteurl: string;
  graphClient: MSGraphClient;
}
