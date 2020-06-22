import { SPHttpClient } from "@microsoft/sp-http";
import { IEventDetailsWebPartProps } from "../IEventDetailsWebPartProps";

export interface IEventDetailsProps extends IEventDetailsWebPartProps {
  isWorkbench: boolean;
  siteUrl: string;
  spHttpClient: SPHttpClient;

}
