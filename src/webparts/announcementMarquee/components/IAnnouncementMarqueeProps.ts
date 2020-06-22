
import { IAnnouncementMarqueeWebPartProps } from '../IAnnouncementMarqueeWebPartProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IAnnouncementMarqueeProps extends IAnnouncementMarqueeWebPartProps {
  siteurl: string;
  spHttpClient: SPHttpClient;
}
