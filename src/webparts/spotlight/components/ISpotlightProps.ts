import { MSGraphClient } from '@microsoft/sp-http';
import { ISpotlightWebPartProps } from '../ISpotlightWebPartProps';

export interface ISpotlightProps extends ISpotlightWebPartProps {
  siteUrl: string;
  graphClient: MSGraphClient;
}
