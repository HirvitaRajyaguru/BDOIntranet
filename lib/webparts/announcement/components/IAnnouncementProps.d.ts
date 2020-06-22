import { IAnnouncementWebPartProps } from '../IAnnouncementWebPartProps';
import { SPHttpClient } from '@microsoft/sp-http';
export interface IAnnouncementProps extends IAnnouncementWebPartProps {
    siteurl: string;
    spHttpClient: SPHttpClient;
}
//# sourceMappingURL=IAnnouncementProps.d.ts.map