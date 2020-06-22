

import { MSGraphClient } from '@microsoft/sp-http';
import { IGlobalPartnerSpeakWebPartProps } from '../IGlobalPartnerSpeakWebPartProps';

export interface IGlobalPartnerSpeakProps extends IGlobalPartnerSpeakWebPartProps {
  siteUrl: string;
  graphClient: MSGraphClient;
}
