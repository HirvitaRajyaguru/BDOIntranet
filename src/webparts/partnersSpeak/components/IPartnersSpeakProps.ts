import { IPartnersSpeakWebpartProps } from '../IPartnersSpeakWebpartProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IPartnersSpeakProps extends IPartnersSpeakWebpartProps{
  siteUrl: string;
  graphClient: MSGraphClient;
}



