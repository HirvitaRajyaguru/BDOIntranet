import { IAnnouncementMarqueeWebPartProps } from '../IAnnouncementMarqueeWebPartProps';
import { SPHttpClient } from '@microsoft/sp-http';
export interface IAnnouncementMarqueeProps extends IAnnouncementMarqueeWebPartProps {
    siteurl: string;
    spHttpClient: SPHttpClient;
}
//# sourceMappingURL=IAnnouncementMarqueeProps.d.ts.map